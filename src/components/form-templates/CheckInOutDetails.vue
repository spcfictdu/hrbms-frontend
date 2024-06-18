<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Checked-in/out </template>
    </title-slot>

    <div v-for="(i, index) in cardDetails" :key="index">
      <check-card
        :card="i.card"
        :class="{ 'mb-2': index < cardDetails.length - 1 }"
      />
    </div>
  </div>
</template>

<script>
import CheckCard from "../hotel-rooms/forms/CheckCard.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "CheckInOutDetails",
  props: ["cardTimeInformation"],
  data: () => ({}),
  components: {
    TitleSlot,
    CheckCard,
  },
  methods: {},
  computed: {
    cardDetails() {
      return [
        {
          card: {
            status: "Checked-in",
            time: this.cardTimeInformation.checkIn
              ? this.cardTimeInformation.checkIn
              : null,
          },
        },
        {
          card: {
            status: "Checked-out",
            time: this.cardTimeInformation.checkOut
              ? this.cardTimeInformation.checkOut
              : null,
          },
        },
      ];
    },
  },
};
</script>

<style scoped></style>
