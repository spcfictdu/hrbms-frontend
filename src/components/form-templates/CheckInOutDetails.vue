<template>
  <FormSection title="Checked-in/out" class="pb-8">
    <div v-for="(i, index) in cardDetails" :key="index">
      <check-card
        :card="i.card"
        :class="{ 'mb-2': index < cardDetails.length - 1 }"
      />
    </div>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import CheckCard from "../hotel-rooms/forms/CheckCard.vue";
export default {
  name: "CheckInOutDetails",
  components: {
    CheckCard,
    FormSection,
  },
  props: {
    cardTimeInformation: Object,
  },
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
