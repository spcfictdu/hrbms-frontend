<template>
  <div class="pb-8">
    <v-form>
      <title-slot>
        <template v-slot:title> Transaction </template>
      </title-slot>

      <label-slot>
        <template v-slot:label> Status </template>
      </label-slot>
      <v-select
        outlined
        dense
        :items="statuses"
        v-model="payload.status"
        hide-details="auto"
      ></v-select>
    </v-form>
  </div>
</template>

<script>
import LabelSlot from "./slots/LabelSlot.vue";
import TitleSlot from "./slots/TitleSlot.vue";
export default {
  name: "TransactionTemplate",
  data: () => ({
    statuses: ["For Reservation", "For Booking"],
    payload: {
      status: null,
    },
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
};
</script>

<style scoped></style>
