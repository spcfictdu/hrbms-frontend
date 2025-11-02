<template>
  <v-card flat class="pa-8">
    <div class="d-flex flex-column pb-5" style="gap: 0.75rem">
      <v-skeleton-loader type="heading" height="16" width="250" />
      <v-skeleton-loader type="text" height="22" width="200" />
    </div>
    <div>
      <v-skeleton-loader type="heading" height="14" />
      <v-divider class="mt-2" />
    </div>
    <div v-for="m in 4" :key="m" class="my-3 font-weight-regular">
      <div
        v-for="n in 3"
        :key="n"
        class="d-flex justify-space-between align-center mb-2"
      >
        <v-skeleton-loader type="text" height="16px" width="100px" />
        <v-skeleton-loader type="text" height="16px" width="60px" />
      </div>
      <v-divider class="mt-2" />
    </div>
    <v-skeleton-loader class="mt-6" type="button" width="100%" />
  </v-card>
</template>

<script>
export default {
  name: "TotalBillCardSkeleton",
};
</script>

<style scoped>
.v-skeleton-loader >>> .v-skeleton-loader__button {
  width: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__heading {
  height: 100%;
}
</style>
