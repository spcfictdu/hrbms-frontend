<template>
  <div class="text-uppercase">
    <v-divider v-if="!isFirstRow" class="pb-2"></v-divider>
    <p class="font-weight-bold text-body-2">
      Cashier Drawer {{ drawerNumber }}
    </p>

    <v-card flat class="d-flex flex-column flex-md-row ps-2 my-6">
      <div>
        <v-card-title class="font-weight-bold">First Floor Lobby</v-card-title>
        <v-card-text>
          LAST OPENED BY | <span class="font-weight-bold">S45</span>
        </v-card-text>
      </div>

      <v-card-actions class="ml-md-auto align-start pa-4">
        <v-btn block small depressed rounded color="primary" class="px-7"
          >OPEN</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "CashierDrawer",
  props: {
    drawerNumber: String,
    isFirstRow: Boolean,
  },
};
</script>

<style scoped>
.v-card__title {
  color: var(--v-primary-base);
  word-break: normal;
}
</style>
