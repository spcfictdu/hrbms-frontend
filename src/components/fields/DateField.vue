<template>
  <v-menu
    :close-on-content-click="false"
    offset-y
    transition="scale-transition"
    v-model="menu"
    min-width="auto"
    max-width="290"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-on="on"
        v-bind="attrs"
        outlined
        dense
        readonly
        hide-details="auto"
        :value="withFormat ? formatDate(date) : date"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :min="minDate"
      @change="handleDate"
      :readonly="readonly"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { format, parseISO } from "date-fns";
export default {
  name: "DateField",
  props: {
    minDate: String,
    rules: Array,
    model: String,
    value: String,
    readonly: Boolean,
    withFormat: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    date: null,
    menu: false,
  }),
  methods: {
    handleDate: function (date) {
      this.date = date;

      this.$emit("input", date);
      this.menu = false;
    },
    formatDate: function (date) {
      return date ? format(parseISO(date), "MMMM dd, yyyy") : null;
    },
  },
  watch: {
    model: {
      immediate: true,
      handler: function (val) {
        this.date = val;
      },
    },
  },
};
</script>

<style scoped></style>
