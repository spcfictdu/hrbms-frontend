<template>
  <div class="pb-8">
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
  },
};
</script>

<style scoped></style>
