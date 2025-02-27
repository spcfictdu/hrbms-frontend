<template>
  <div class="d-flex align-center" style="gap: 16px">
    <v-btn v-if="withClose" icon @click="$emit('onClose')">
      <v-icon>mdi-close</v-icon></v-btn
    >
    <div
      class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase"
    >
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "DialogToolbar",
  props: {
    title: String,
    withClose: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
