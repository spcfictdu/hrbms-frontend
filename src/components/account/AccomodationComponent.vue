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
        >{{ category }}
      </v-btn>
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
      <v-col
        cols="12"
        v-for="(transaction, index) in finalizedData"
        :key="index"
      >
        <transaction-card
          :selectedButton="selectedButton"
          :transaction="transaction"
          @transaction-event="(e) => $emit('transaction-event', e)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TransactionCard from "./TransactionCard.vue";

export default {
  name: "AccommodationComponent",
  props: { accommodationData: Array },
  components: { TransactionCard },
  data: () => ({
    selectedButton: "Bookings",
    buttons: ["Bookings", "Reservations", "History"],
  }),
  methods: {
    selectCategory: function (category) {
      this.selectedButton = category;
    },
  },
  computed: {
    finalizedData: function () {
      return this.accommodationData && this.accommodationData.length > 0
        ? this.accommodationData
        : [{}];
    },
  },
  watch: {
    selectedButton: {
      immediate: true,
      handler: function (newVal) {
        this.$emit("selected-button", newVal);
      },
    },
  },
};
</script>

<style scoped></style>
