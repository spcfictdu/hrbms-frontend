<template>
  <v-menu
    :close-on-content-click="false"
    offset-y
    transition="scale-transition"
    min-width="auto"
    max-width="290"
    v-model="menu"
  >
    <template #activator="{ attrs, on }">
      <v-text-field
        v-on="on"
        v-bind="attrs"
        outlined
        dense
        readonly
        hide-details="auto"
        :value="formattedTime"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="disabled"
      v-model="time"
      scrollable
      active-picker="HOUR"
      @change="handleTime"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import { formatTime } from "@/mixins/FormattingFunctions";
export default {
  name: "TimeField",
  mixins: [formatTime],
  props: {
    rules: Array,
    model: String,
    value: String,
    disabled: Boolean,
  },
  data: () => ({
    menu: false,
    time: null,
  }),
  methods: {
    handleTime: function (time) {
      this.time = time;

      this.$emit("input", time);
      this.menu = false;
    },
  },
  computed: {
    formattedTime() {
      //Show the time in another format
      const now = new Date().toISOString().slice(0, 10);
      const dateString = `${now}T${this.time}:00`;
      return this.time ? this.formatTime(dateString) : null;
    },
  },
  watch: {
    model: {
      immediate: true,
      handler: function (val) {
        this.time = val;
      },
    },
  },
};
</script>

<style scoped></style>
