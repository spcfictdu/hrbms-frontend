<template>
  <div class="d-flex justify-space-between align-center pb-8">
    <div>
      <div class="text-body-1 font-weight-bold text-uppercase mb-1">
        {{ client }}
      </div>
      <div class="d-flex align-center">
        <slot name="chip">
          <v-chip
            small
            class="text-outline white--text font-weight-bold text-uppercase mr-2"
            :color="getColor(status.type)"
            >{{ status.type }}</v-chip
          >
        </slot>

        <div class="text-caption font-weight-regular grey--text text--darken-2">
          <span class="font-weight-bold text-uppercase">From:</span>
          {{ `${formatDate(from.date)} (${formatTime(from.date)})` }} |
          <span class="font-weight-bold text-uppercase">To:</span>
          {{ `${formatDate(to.date)} (${formatTime(to.date)})` }}
        </div>
      </div>
    </div>
    <div v-if="showButton(status.type)">
      <slot name="button">
        <v-btn
          @click="$emit('button-event')"
          :outlined="button.style.outlined"
          :color="button.style.color"
          :disabled="button.disabled"
          >{{ button.title }}</v-btn
        >
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderBookingSlot",
  props: ["headerData"],
  methods: {
    getColor: function (status) {
      let color = null;
      if (status === "Confirmed") {
        color = "confirmed";
      } else if (status === "Checked-in") {
        color = "checkedin";
      } else if (status === "Checked-out") {
        color = "checkedout";
      } else if (status === "Housekeeping") {
        color = "housekeeping";
      } else if (status === "Reserved") {
        color = "reserved";
      }
      return color;
    },
    showButton(status) {
      return status === "Checked-out" ? false : true;
    },
    formatDate: function (date) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `${formattedDate}`;
    },
    formatTime: function (date) {
      const formattedTime = new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedTime}`;
    },
  },
  computed: {
    button() {
      return this.headerData.button;
    },
    from() {
      return this.headerData.from;
    },
    to() {
      return this.headerData.to;
    },
    status() {
      return this.headerData.status;
    },
    client() {
      return this.headerData.client;
    },
  },
};
</script>
