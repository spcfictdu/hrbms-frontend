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
            :color="status.color"
            >{{ status.type }}</v-chip
          >
        </slot>

        <div class="text-caption font-weight-regular grey--text text--darken-2">
          <span class="font-weight-bold text-uppercase">From:</span>
          {{ `${from.date} (${from.time})` }} |
          <span class="font-weight-bold text-uppercase">To:</span>
          {{ `${to.date} (${to.time})` }}
        </div>
      </div>
    </div>
    <div>
      <slot name="button">
        <v-btn :outlined="button.style.outlined" :color="button.style.color">{{
          button.title
        }}</v-btn>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderBookingSlot",
  props: ["headerData"],
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
