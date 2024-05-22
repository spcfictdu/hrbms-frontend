<template>
  <div class="pb-8">
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
      @change="emitTransaction"
      clearable
      :rules="rules.status"
      required
    ></v-select>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "TransactionTemplate",
  props: ["statuses"],
  data: () => ({
    payload: {
      status: null,
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
      errors.status = [(v) => !!v || "Status is required"];
      return errors;
    },
  },
};
</script>

<style scoped></style>
