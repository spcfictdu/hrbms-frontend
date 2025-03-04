<template>
  <div>
    <LabelSlot>{{ label }}</LabelSlot>
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
  },
};
</script>

<style scoped></style>
