<template>
  <div>
    <v-card
      style="border: 1px solid rgba(51, 51, 51, 0.1)"
      flat
      min-height="70"
      class="d-none d-sm-flex"
    >
      <v-card-title class="justify-space-between flex-grow-1">
        <v-skeleton-loader type="text" v-for="n in 3" :key="n" width="100" />
        <v-skeleton-loader type="chip" height="24" />
        <v-skeleton-loader type="avatar" height="32" width="32" />
      </v-card-title>
    </v-card>
    <v-card
      style="border: 1px solid rgba(51, 51, 51, 0.1)"
      flat
      min-height="78"
      class="d-flex d-sm-none"
    >
      <v-card-title class="justify-space-between flex-grow-1">
        <div>
          <v-skeleton-loader type="text" width="100" />
          <v-skeleton-loader type="text" width="80" />
        </div>
        <div class="d-flex align-center">
          <v-skeleton-loader type="chip" height="24" class="mr-3" />
          <v-skeleton-loader type="avatar" height="32" width="32" />
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "RoomListCardSkeleton",
};
</script>

<style scoped>
.v-skeleton-loader >>> .v-skeleton-loader__chip {
  width: 80px;
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__avatar {
  width: 100%;
  height: 100%;
}
</style>
