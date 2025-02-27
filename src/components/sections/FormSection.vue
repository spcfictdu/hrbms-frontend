<template>
  <div>
    <TitleSlot>{{ title }}</TitleSlot>

    <div>
      <slot />
    </div>
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
