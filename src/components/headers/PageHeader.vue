<template>
  <v-container class="pa-0">
    <div
      class="w-full d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <div>
        <p
          class="text-md-h5 text-h6 font-weight-bold mb-2 mb-sm-1"
          :class="{ 'text-uppercase': isUpperCase }"
        >
          {{ headerText ?? $route.meta.name }}
        </p>
        <slot name="subtitle"></slot>
      </div>

      <slot />
    </div>

    <v-divider :style="{ marginTop: `${dividerMarginTop}px` }" />
  </v-container>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    headerText: String,
    isUpperCase: Boolean,
    dividerMarginTop: Number,
  },
  data: () => ({}),
};
</script>

<style scoped></style>
