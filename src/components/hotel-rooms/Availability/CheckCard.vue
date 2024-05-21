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
        <div>{{ formatDate(card.time) }}</div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "CheckCard",
  props: ["card"],
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
    formatDate(date) {
      if (date) {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${formattedDate} - ${formattedTime}`;
      }
      return "- -";
    },
  },
  computed: {},
};
</script>

<style scoped></style>
