<template>
  <div class="pb-8" v-if="bookingSummary">
    <FormSection title="Booking Summary">
      <TotalBillCard :value="bookingSummary" :loading="loading" />
    </FormSection>
  </div>
</template>

<script>
import TotalBillCard from "../hotel-rooms/forms/TotalBillCard.vue";
import FormSection from "../sections/FormSection.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingSummary",
  components: {
    TotalBillCard,
    FormSection,
  },
  props: {
    loading: Boolean,
    clientMeta: Object,
    queryParams: Object,
    btnStyling: Object,
  },
  data: () => ({}),

  methods: {
    ...mapActions("roomEnum", ["fetchRoom"]),
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    bookingSummary: function () {
      const room = this.room ? this.room[0] : null;

      if (!room) return;

      let data = [
        {
          title: "Guest Name",
          value: this.clientMeta.clientName,
        },
      ];

      if (
        ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"].includes(
          this.clientMeta.status
        )
      ) {
        data.push(
          {
            title: "Room",
            value: room.roomNumber,
          },
          {
            title: "Floor",
            value: `Floor ${room.roomFloor}`,
          }
        );
      }

      // Total Bill
      const total = room.roomTotalWithExtraPerson;

      // Total Received
      const totalReceived = this.clientMeta.amountReceived;

      // Total Outstanding Bill
      const totalOutstanding =
        total - totalReceived < 0 ? 0 : total - totalReceived;

      // Total Change
      const totalChange = totalReceived > total ? totalReceived - total : 0;

      // console.log(room);
      return {
        receiptHeader: data,
        receiptEnums: {
          type: room.roomType,
          roomNumber: room.roomNumber,
          capacity: room.roomTypeCapacity,
          roomFloor: room.roomFloor,
          roomTotal: room.roomTotal,
          extraPersonTotal: room.extraPersonTotal,
          total: room.roomTotalWithExtraPerson,
          roomRatesArray: room.roomRatesArray,
        },
        clientInput: {
          totalReceived: totalReceived,
          totalOutstanding: totalOutstanding,
          totalChange: totalChange,
        },
        button: this.btnStyling,
      };
    },
  },
  watch: {
    queryParams: {
      immediate: true,
      handler: async function (v) {
        await this.fetchRoom(v);

        // Needed by the Parent Component
        this.$emit("capacity", this.room[0].extraPersonCapacity);
        this.$emit("totalPayment", this.room[0].roomTotalWithExtraPerson);
      },
    },
  },
};
</script>

<style scoped></style>
