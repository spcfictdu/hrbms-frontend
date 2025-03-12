<template>
  <div class="pt-5 pb-7">
    <div
      class="d-flex flex-sm-row flex-column justify-sm-space-between align-sm-center mb-4"
    >
      <div class="text-overline font-weight-bold">{{ title }}</div>
      <slot name="headerItem" />
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  name: "InfoSection",
  props: { title: String },
  data: () => ({}),
};
</script>

<style scoped></style>
