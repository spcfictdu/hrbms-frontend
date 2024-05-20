<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Booking Summary </template>
    </title-slot>

    <div>
      <total-bill-slot
        @validation-event="$emit('validation-event')"
        :totalInformation="totalInformation"
      >
      </total-bill-slot>
    </div>
  </div>
</template>

<script>
import TitleSlot from "../slots/TitleSlot.vue";
import TotalBillSlot from "../hotel-rooms/availability/TotalBillCard.vue";
export default {
  name: "BookingSummary",
  props: {
    isStatus: {
      type: String,
      required: true,
    },
    cardInformation: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
  components: {
    TitleSlot,
    TotalBillSlot,
  },
  methods: {},
  computed: {
    totalInformation() {
      let data = [
        {
          title: "Guest Name",
          value: this.cardInformation.client,
        },
      ];
      if (this.isStatus === "For Booking") {
        data.push(
          {
            title: "Room",
            value: "Room D1",
          },
          {
            title: "Floor",
            value: "Floor 4",
          }
        );
      }
      return {
        title: this.cardInformation.type,
        room: this.cardInformation.roomName,
        occupancy: 5,
        guest: data,
        totalPayment: {
          roomTotal: 2000,
          extraPersonTotal: 0,
          total: 2000,
          totalReceived: 0,
          totalOutstanding: 2000,
        },
        button: this.cardInformation.button,
      };
    },
  },
};
</script>

<style scoped></style>
