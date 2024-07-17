<template>
  <v-card
    flat
    outlined
    class="card-container transparent-bg d-flex justify-center align-center"
  >
    <div class="d-flex align-center" v-if="meta.loading">
      <v-progress-circular
        color="primary"
        size="28"
        width="3"
        indeterminate
      ></v-progress-circular>
      <div class="ml-4">Loading {{ meta.title.toLowerCase() }}...</div>
    </div>
    <div v-else class="d-flex">
      There are no available {{ meta.title.toLowerCase() }}.
    </div>
  </v-card>
</template>

<script>
export default {
  name: "NoDataFoundCard",
  props: { meta: Object },
  data: () => ({}),
};
</script>

<style scoped>
.card-container {
  padding: 16px 20px;
  border-radius: 10px;
  min-height: 150px;
}

.transparent-bg {
  background: transparent;
}
</style>
