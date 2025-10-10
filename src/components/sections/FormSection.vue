<template>
  <div :class="paddingBottom">
    <div class="d-flex align-center justify-space-between mb-4">
      <slot name="title" />
      <TitleSlot>{{ title }}</TitleSlot>

      <slot name="actions" />
    </div>

    <slot />
  </div>
</template>

<script>
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "FormSection",
  components: { TitleSlot },
  props: {
    title: String,
    paddingBottom: {
      type: String,
      default: "pb-8",
    },
  },
};
</script>

<style scoped></style>
