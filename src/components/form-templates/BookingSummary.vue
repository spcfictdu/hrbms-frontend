<template>
  <FormSection title="Booking Summary" class="pb-8">
    <TotalBillCard v-if="room" :value="bookingSummary" :loading="loading" />
    <v-card
      flat
      min-height="575"
      class="d-flex justify-center align-center"
      v-else
    >
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </v-card>
  </FormSection>
</template>

<script>
import TotalBillCard from "../hotel-rooms/forms/TotalBillCard.vue";
import FormSection from "../sections/FormSection.vue";
import { mapActions, mapMutations, mapState } from "vuex";
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
    ...mapMutations("roomEnum", ["SET_ROOM"]),
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    ...mapState("vouchers", ["activeVoucher"]),
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

      const roundToTwoDecimal = (val) => Math.round(val * 100) / 100;

      const roomTotal = room.roomRatesArray.reduce(
        (total, room) => total + room.rate,
        0
      );

      const extraPersonTotal = room.roomRatesArray.reduce(
        (total, room) => total + room.extraPersonRate,
        0
      );

      const totalWithoutAddons = roomTotal + extraPersonTotal;

      // Total Bill
      const total = room.roomTotalWithExtraPerson;

      // Total Received
      const totalReceived = this.clientMeta.amountReceived;

      const discountedValue = roundToTwoDecimal(
        totalWithoutAddons * (room.discount.split("%")[0] * 0.01)
      );

      // Total Outstanding Bill
      const totalOutstanding = roundToTwoDecimal(
        total - totalReceived < 0 ? 0 : total - totalReceived
      );

      // Total Change
      const totalChange = roundToTwoDecimal(
        totalReceived > total ? totalReceived - total : 0
      );

      const summary = {
        receiptHeader: data,
        receiptEnums: {
          type: room.roomType,
          roomNumber: room.roomNumber,
          capacity: room.roomTypeCapacity,
          roomFloor: room.roomFloor,
          roomTotal,
          extraPersonTotal,
          total: roomTotal + extraPersonTotal + room.addonsTotal,
          roomRatesArray: room.roomRatesArray,
          addonsArray: room.addons,
          discount: room.discount,
          discountedValue,
          addonsTotal: room.addonsTotal,
        },
        clientInput: {
          totalReceived: totalReceived,
          totalOutstanding: totalOutstanding,
          totalChange: totalChange,
        },
        button: this.btnStyling,
      };

      if (this.activeVoucher) {
        summary.receiptEnums.voucherCode = this.activeVoucher.code;
      }

      return summary;
    },
  },
  beforeDestroy() {
    this.SET_ROOM(null);
  },
  watch: {
    queryParams: {
      immediate: true,
      deep: true,
      handler: async function (v) {
        const data = {
          ...v,
          ...(v.addons && {
            addons: v.addons
              .filter(({ name }) => name)
              .map(({ name, quantity }) => `${name}-${quantity}`),
          }),
        };

        if (!data.addons) {
          this.$delete(data, "addons");
        }

        await this.fetchRoom(data);

        // Needed by the Parent Component
        this.$emit("capacity", this.room[0].extraPersonCapacity);
        this.$emit("totalPayment", this.room[0].roomTotalWithExtraPerson);
      },
    },
  },
};
</script>

<style scoped></style>
