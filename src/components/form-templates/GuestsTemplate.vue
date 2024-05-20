<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Guests </template>
    </title-slot>

    <div>
      <label-slot>
        <template v-slot:label> Extra Person </template>
      </label-slot>
      <v-text-field
        type="number"
        dense
        hide-details="auto"
        outlined
        v-model="payload.guests"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "GuestsTemplate",
  data: () => ({
    payload: {
      guests: 0,
    },
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
  computed: {
    rules() {
      const errors = {};
      return errors;
    },
  },
};
</script>

<style scoped></style>
