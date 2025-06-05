<template>
  <div>
    <div class="text-caption ml-1 mb-1" :class="{ 'text-overline': isBold }">
      <slot name="label"></slot>
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "FormField",
  props: {
    label: String,
    isBold: { type: Boolean, default: false },
  },
};
</script>

<style scoped></style>
