<template>
  <div class="mt-8">
    <!-- Transaction Type Buttons -->
    <div class="d-none d-sm-flex">
      <v-btn
        :plain="selectedButton !== category"
        :text="selectedButton === category"
        v-for="(category, index) in buttons"
        :key="index"
        @click="selectCategory(category)"
        class="font-weight-bold"
        :ripple="false"
        >{{ category }}</v-btn
      >
    </div>

    <div class="d-flex d-sm-none">
      <v-autocomplete
        dense
        outlined
        hide-details="auto"
        :items="buttons"
        v-model="selectedButton"
        label="Transaction Category"
      ></v-autocomplete>
    </div>

    <!-- Transaction Cards -->
    <v-row class="mt-6">
      <v-col cols="12" v-for="i in 1" :key="i">
        <transaction-card />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TransactionCard from "./TransactionCard.vue";
export default {
  name: "AccomodationComponent",
  components: { TransactionCard },
  data: () => ({
    selectedButton: null,
    buttons: ["Bookings", "Reservations", "History"],
  }),
  methods: {
    selectCategory: function (category) {
      this.selectedButton = category;
    },
  },
};
</script>

<style scoped></style>
