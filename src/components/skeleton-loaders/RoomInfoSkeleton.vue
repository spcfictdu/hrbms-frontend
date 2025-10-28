<template>
  <div>
    <div class="d-flex" style="gap: 1rem">
      <div class="d-flex flex-column flex-grow-1">
        <v-skeleton-loader class="flex-grow-1" type="heading" height="32" />
        <p>
          <v-skeleton-loader
            class="flex-grow-1"
            type="text"
            height="22"
            width="300"
          />
        </p>
      </div>
      <v-skeleton-loader type="avatar" height="36" width="36" />
    </div>
    <v-skeleton-loader type="text" width="65%" />
    <v-divider class="mt-7" />
    <div class="pt-5 pb-7">
      <v-skeleton-loader type="text" height="32" width="100" />
      <div class="d-flex" style="gap: 0.5rem">
        <v-skeleton-loader v-for="n in 6" :key="n" type="chip" height="24" />
      </div>
    </div>
    <v-divider />
  </div>
</template>

<script>
export default {
  name: "RoomInfoSkeleton",
};
</script>

<style scoped>
.v-skeleton-loader >>> .v-skeleton-loader__avatar {
  width: 100%;
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__chip {
  height: 100%;
}
</style>
