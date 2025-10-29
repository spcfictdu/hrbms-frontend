<template>
  <div>
    <div class="d-flex justify-space-between pb-8">
      <div class="d-flex flex-column" style="gap: 0.75rem">
        <v-skeleton-loader type="heading" height="16" width="600" />
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-skeleton-loader type="chip" height="24" />
          <v-skeleton-loader
            class="d-flex align-center"
            type="text"
            height="24"
            width="400"
          />
        </div>
      </div>

      <div class="d-flex align-center" style="gap: 1rem">
        <v-skeleton-loader class="flex-grow-1" type="button" width="212" />
        <v-skeleton-loader type="avatar" height="36" width="36" />
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-divider class="mb-2" />
        <div>
          <v-skeleton-loader
            class="mt-5 mb-2"
            type="text"
            height="32"
            width="150"
          />
          <div class="d-flex flex-column mb-9" style="gap: 0.5rem">
            <v-card
              height="56"
              flat
              color="lightBg"
              class="pa-4 d-flex justify-space-between align-center"
              v-for="n in 2"
              :key="n"
            >
              <v-skeleton-loader type="text" width="120" />
              <v-skeleton-loader type="text" width="100" />
            </v-card>
          </div>
        </div>

        <div class="d-flex justify-space-between">
          <v-skeleton-loader type="text" width="150" />
          <v-skeleton-loader type="button" width="105" height="28" />
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-divider class="mb-2" />
        <v-skeleton-loader
          class="mt-5 mb-2"
          type="text"
          height="32"
          width="150"
        />
        <TotalBillCardSkeleton />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FlightDetailsCardSkeleton from "./FlightDetailsCardSkeleton.vue";
import TotalBillCardSkeleton from "./TotalBillCardSkeleton.vue";

export default {
  name: "TransactionSkeleton",
  components: { FlightDetailsCardSkeleton, TotalBillCardSkeleton },
  props: {
    transaction: Boolean,
  },
};
</script>

<style scoped>
.v-skeleton-loader >>> .v-skeleton-loader__heading {
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__chip {
  height: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__button {
  width: 100%;
}

.v-skeleton-loader >>> .v-skeleton-loader__avatar {
  width: 100%;
  height: 100%;
}
</style>
