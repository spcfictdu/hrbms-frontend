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
        @change="emitTransaction"
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
  methods: {
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },
  },
  computed: {
    rules() {
      const errors = {};
      return errors;
    },
  },
};
</script>

<style scoped></style>
