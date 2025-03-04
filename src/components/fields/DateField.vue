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
        :value="date"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :min="minDate"
      @change="handleDate"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "DateField",
  props: {
    minDate: String,
    rules: Array,
    model: String,
    value: String,
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
