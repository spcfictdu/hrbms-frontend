<template>
  <div class="text-uppercase">
    <v-divider v-if="!isFirstRow" class="pb-2"></v-divider>
    <p class="font-weight-bold text-body-2">
      Cashier Drawer {{ drawerNumber }}
    </p>

    <v-card
      flat
      class="my-6"
      @click="showDetails = !showDetails"
      :ripple="false"
    >
      <div class="d-flex flex-column flex-md-row">
        <div class="ps-2">
          <v-card-title class="font-weight-bold"
            >First Floor Lobby</v-card-title
          >
          <v-card-text>
            LAST OPENED BY |
            <span class="font-weight-bold">S{{ sessionData.userId }}</span>
          </v-card-text>
        </div>

        <v-card-actions class="ml-md-auto align-start pa-4">
          <v-btn
            block
            small
            depressed
            rounded
            :color="sessionData.status === 'ACTIVE' ? 'primary' : 'lightBg'"
            class="px-4"
            @click.stop="showConfirmationDialog"
          >
            {{ sessionData.status === "ACTIVE" ? "ACTIVE" : "INACTIVE" }}
          </v-btn>
        </v-card-actions>
      </div>

      <CashierDrawerDetails
        :showDetails="showDetails"
        :sessionData="sessionData"
        :drawerNumber="drawerNumber"
      />
    </v-card>
  </div>
</template>

<script>
import CashierDrawerDetails from "./CashierDrawerDetails.vue";
import { mapMutations } from "vuex";

export default {
  name: "CashierDrawer",
  components: { CashierDrawerDetails },
  props: {
    drawerNumber: Number,
    isFirstRow: Boolean,
    sessionData: Object,
  },
  data: () => ({
    showDetails: false,
  }),
  methods: {
    ...mapMutations("cashier", ["SET_DIALOG", "SET_CURRENT_CASHIER"]),

    showConfirmationDialog() {
      this.SET_DIALOG({ key: "confirmation", value: true });
      this.SET_CURRENT_CASHIER({
        session: this.sessionData,
        drawerNumber: this.drawerNumber,
      });
    },
  },
};
</script>

<style scoped>
.v-card__title {
  color: var(--v-primary-base);
  word-break: normal;
}
</style>
