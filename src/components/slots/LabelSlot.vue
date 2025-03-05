<template>
  <div class="text-caption ml-1 mb-1" :class="{ 'text-overline': isBold }">
    <slot name="label"></slot>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    isBold: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
