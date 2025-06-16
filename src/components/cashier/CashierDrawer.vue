<template>
  <div class="text-uppercase">
    <v-divider v-if="!isFirstRow" class="pb-2"></v-divider>
    <p class="font-weight-bold text-body-2">
      Cashier Drawer {{ drawerNumber }}
    </p>

    <v-card flat class="my-6">
      <div class="d-flex flex-column flex-md-row">
        <div class="ps-2">
          <v-card-title class="font-weight-bold"
            >First Floor Lobby</v-card-title
          >
          <v-card-text>
            LAST OPENED BY | <span class="font-weight-bold">S45</span>
          </v-card-text>
        </div>

        <v-card-actions class="ml-md-auto align-start pa-4">
          <v-btn
            block
            small
            depressed
            rounded
            :color="showDetails ? 'lightBg' : 'primary'"
            class="px-6"
            @click="showDetails = !showDetails"
          >
            {{ showDetails ? "CLOSE" : "OPEN" }}
          </v-btn>
        </v-card-actions>
      </div>

      <CashierDrawerDetails :showDetails="showDetails" />
    </v-card>
  </div>
</template>

<script>
import CashierDrawerDetails from "./CashierDrawerDetails.vue";

export default {
  name: "CashierDrawer",
  components: { CashierDrawerDetails },
  props: {
    drawerNumber: Number,
    isFirstRow: Boolean,
  },
  data: () => ({
    showDetails: false,
  }),
};
</script>

<style scoped>
.v-card__title {
  color: var(--v-primary-base);
  word-break: normal;
}
</style>
