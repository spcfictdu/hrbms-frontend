<template>
  <v-container class="pa-0 d-flex flex-column">
    <div class="w-full d-flex flex-sm-row align-center">
      <v-btn
        v-if="backButton"
        class="mr-3 mr-sm-10"
        fab
        small
        depressed
        color="#DDE2FE"
        @click="$router.go(-1)"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div class="flex-grow-1 flex-shrink-0">
        <p
          class="text-md-h5 text-h6 font-weight-bold mb-1"
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
    backButton: Boolean,
  },
  data: () => ({}),
};
</script>

<style scoped></style>
