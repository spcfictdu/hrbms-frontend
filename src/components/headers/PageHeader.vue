<template>
  <v-container class="pa-0">
    <div
      class="w-full d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <p class="text-md-h5 text-h6 font-weight-bold mb-2 mb-sm-1">
        {{ $route.meta.name }}
      </p>
    </div>
    <v-divider />
  </v-container>
</template>

<script>
export default {
  name: "PageHeader",
  data: () => ({}),
};
</script>

<style scoped></style>
