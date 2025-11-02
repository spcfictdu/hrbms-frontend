<template>
  <v-card
    flat
    class="mt-4 d-flex justify-space-between"
    height="86"
    color="lightBg"
  >
    <div class="d-flex flex-column flex-grow-1 pa-4" style="gap: 0.75rem">
      <v-skeleton-loader class="mt-2" type="heading" height="20" />
      <v-skeleton-loader type="text" height="14" />
    </div>
    <v-card-actions class="pr-6" style="gap: 0.5rem">
      <v-skeleton-loader type="chip" height="24" />
      <v-skeleton-loader type="avatar" height="26" width="26" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FlightDetailsCardSkeleton",
};
</script>

<style scoped>
.v-skeleton-loader >>> .v-skeleton-loader__heading {
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__text {
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__chip {
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__avatar {
  width: 100%;
  height: 100%;
}
</style>
