<template>
  <div
    class="d-flex flex-column flex-sm-row justify-space-between align-center pb-8"
  >
    <div>
      <div
        class="text-h6 text-sm-body-1 font-weight-bold text-uppercase mb-0 mb-md-1 text-center text-sm-start"
      >
        {{ client }}
      </div>
      <div class="d-flex flex-column flex-sm-row align-center">
        <slot name="chip">
          <v-chip
            small
            class="text-outline white--text font-weight-bold text-uppercase mr-2"
            :color="getColor[status.type]"
            >{{ status.type }}</v-chip
          >
        </slot>

        <div
          class="text-caption font-weight-regular grey--text text--darken-2 mt-1 mt-sm-0"
        >
          <span class="font-weight-bold text-uppercase">From:</span>
          {{ `${formatDate(from.date)} (${formatTime(from.date)})` }} |

          <span class="font-weight-bold text-uppercase">To:</span>
          {{ `${formatDate(to.date)} (${formatTime(to.date)})` }}
        </div>
      </div>
    </div>
    <slot name="button">
      <v-btn
        v-if="$auth.user().role === 'ADMIN' && showButton(status.type)"
        class="mt-2 mt-sm-0"
        :block="$vuetify.breakpoint.xs ? true : false"
        @click="$emit('button-event')"
        :outlined="button.style.outlined"
        :color="button.style.color"
        :disabled="button.disabled"
        :loading="loading"
        >{{ button.title }}</v-btn
      >
    </slot>
  </div>
</template>

<script>
import { formatDate, formatTime } from "@/mixins/FormattingFunctions";
export default {
  name: "HeaderBookingSlot",
  props: {
    headerData: Object,
    loading: Boolean,
  },
  mixins: [formatDate, formatTime],
  data: () => ({
    getColor: {
      CONFIRMED: "confirmed",
      "CHECKED-IN": "checkedin",
      "CHECKED-OUT": "checkedout",
      HOUSEKEEPING: "housekeeping",
      RESERVED: "reserved",
    },
  }),
  methods: {
    showButton(status) {
      return status === "Checked-out" ? false : true;
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
