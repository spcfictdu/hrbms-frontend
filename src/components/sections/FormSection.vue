<template>
  <div :class="paddingBottom">
    <TitleSlot>{{ title }}</TitleSlot>

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
