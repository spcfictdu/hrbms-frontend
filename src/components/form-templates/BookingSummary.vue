<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Booking Summary </template>
    </title-slot>

    <div>
      <total-bill-card
        @validation-event="$emit('validation-event')"
        :totalInformation="totalInformation"
      >
      </total-bill-card>
    </div>
  </div>
</template>

<script>
import TitleSlot from "../slots/TitleSlot.vue";
import TotalBillCard from "../hotel-rooms/availability/TotalBillCard.vue";
export default {
  name: "BookingSummary",
  props: {
    isStatus: {
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
    TotalBillCard,
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
      if (
        this.isStatus === "CONFIRMED" ||
        this.isStatus === "CHECKED-IN" ||
        this.isStatus === "CHECKED-OUT"
      ) {
        data.push(
          {
            title: "Room",
            value: this.cardInformation.room.roomName,
          },
          {
            title: "Floor",
            value: this.cardInformation.room.roomFloor,
          }
        );
      }
      return {
        room: {
          type: this.cardInformation.room.type,
          room: this.cardInformation.room.roomName,
          capacity: this.cardInformation.room.capacity,
        },
        guest: data,
        payment: {
          roomTotal: this.cardInformation.payment.roomTotal,
          extraPersonTotal: this.cardInformation.payment.extraPersonTotal,
          total: this.cardInformation.payment.total,
          totalReceived: this.cardInformation.payment.totalReceived,
          totalOutstanding: this.cardInformation.payment.totalOutstanding,
          totalChange: this.cardInformation.payment.totalChange,
        },
        button: this.cardInformation.button,
      };
    },
  },
};
</script>

<style scoped></style>
