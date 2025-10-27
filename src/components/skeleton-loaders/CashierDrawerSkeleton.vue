<template>
  <div>
    <v-divider v-if="!isFirstRow" class="pb-2"></v-divider>
    <p class="font-weight-bold text-body-2">
      <v-skeleton-loader type="text" width="40%" />
    </p>

    <v-card flat class="my-6">
      <div class="d-flex flex-column flex-md-row">
        <div class="ps-2">
          <v-card-title>
            <v-skeleton-loader width="225" type="heading" />
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader type="text" max-width="65%" />
          </v-card-text>
        </div>

        <v-card-actions class="ml-md-auto align-start pa-4">
          <v-skeleton-loader
            type="button"
            height="28"
            :style="{ borderRadius: '28px' }"
          />
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "CashierDrawerSkeleton",
  props: {
    isFirstRow: Boolean,
  },
};
</script>
