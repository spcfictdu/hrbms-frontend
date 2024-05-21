<template>
  <div>
    <v-card class="pa-4" color="lightBg" flat>
      <div class="d-flex justify-space-between align-center">
        <div
          class="text-body-2 font-weight-bold text-uppercase"
          :class="`${getColor(card.status)}--text`"
        >
          {{ card.status }}
        </div>
        <div>{{ formatSchedule(card.time) }}</div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { formatDate, formatTime } from "@/mixins/FormattingFunctions";
export default {
  name: "CheckCard",
  props: ["card"],
  mixins: [formatDate, formatTime],
  data: () => ({}),
  methods: {
    getColor(status) {
      let color = "";
      if (status === "Checked-in") {
        color = "checkedin";
      } else if (status === "Checked-out") {
        color = "checkedout";
      }
      return color;
    },
    formatSchedule(date) {
      if (date) {
        return `${this.formatDate(date)} - ${this.formatTime(date)}`;
      }
      return "- -";
    },
  },
  computed: {},
};
</script>

<style scoped></style>
