<template>
  <div>
    <LabelSlot :isBold="isBold">{{ label }}</LabelSlot>
    <slot />
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
export default {
  name: "FormField",
  components: {
    LabelSlot,
  },
  props: {
    label: String,
    isBold: Boolean,
  },
};
</script>

<style scoped></style>
