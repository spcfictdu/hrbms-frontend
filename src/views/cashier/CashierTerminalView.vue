<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader :dividerMarginTop="48" />

    <RouteLoader :target="hasData" :loaderStyles="['mt-10']">
      <CashierDrawerGrid />
    </RouteLoader>

    <ConfirmationDialog
      :opened="dialog.confirmation"
      :onClose="() => handleClose('confirmation')"
      :meta="confirmationDialogMeta"
      @onProceed="handleProceed"
    />

    <CashierDialog
      :opened="dialog.cashier"
      :onClose="() => handleClose('cashier')"
      :meta="cashierDialogMeta"
      :loading="loading.dialog"
      :balanceData="balanceData"
      @submit="handleAction"
    />
  </div>
</template>

<script>
import CashierHeader from "@/components/headers/CashierHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierDrawerGrid from "@/components/cashier/CashierDrawerGrid.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import CashierDialog from "@/components/dialogs/CashierDialog.vue";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "CashierTerminalView",
  components: {
    CashierHeader,
    RouteLoader,
    CashierDrawerGrid,
    ConfirmationDialog,
    CashierDialog,
  },
  data: () => ({}),
  methods: {
    ...mapActions("cashier", ["startSession", "closeSession", "fetchSessions"]),
    ...mapMutations("cashier", [
      "SET_FILTERED_SESSIONS",
      "SET_DIALOG",
      "SET_ADJUSTMENT",
      "SET_CURRENT_CASHIER",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),

    handleClose(dialog) {
      this.SET_DIALOG({ key: dialog, value: false });
      this.SET_ADJUSTMENT("");
    },

    handleProceed() {
      this.SET_DIALOG({ key: "confirmation", value: false });
      this.SET_DIALOG({ key: "cashier", value: true });
    },

    async handleAction(adjustment) {
      this.requireAlertFn(2);

      const userId = this.currentCashier.session.userId;

      let payload = {
        ...adjustment,
      };

      if (this.getCashierAction === "Open") {
        await this.startSession({ userId, payload });
        this.$router.push({ name: "Cashier", params: { id: String(userId) } });
      } else {
        await this.closeSession({
          userId,
          payload,
        });
      }
      await this.fetchSessions();
      this.SET_FILTERED_SESSIONS();

      this.SET_DIALOG({ key: "cashier", value: false });
      this.SET_CURRENT_CASHIER();
    },
  },
  computed: {
    ...mapState("cashier", [
      "sessions",
      "dialog",
      "currentCashier",
      "loading",
      "adjustment",
    ]),
    ...mapGetters("cashier", [
      "getCashierAction",
      "isCurrentCashierSessionless",
    ]),

    hasData() {
      return !!this.sessions.length;
    },

    confirmationDialogMeta() {
      return {
        action: this.getCashierAction,
        actionType:
          this.getCashierAction === "Open"
            ? `Cashier Drawer ${this.currentCashier.drawerNumber}?`
            : "Cashier?",
      };
    },

    cashierDialogMeta() {
      if (this.getCashierAction === "Open")
        return {
          action: "Open",
          actionType: `Cashier Drawer ${this.currentCashier.drawerNumber}`,
          submitBtnText: this.getCashierAction,
        };

      return {
        action: "Adjust",
        actionType: "Closing Balance",
        submitBtnText: this.getCashierAction,
      };
    },

    balanceData() {
      if (!this.currentCashier.session) return;

      const { closingBalance, closingAdjustment } = this.currentCashier.session;
      const newOpeningBalance = this.isCurrentCashierSessionless
        ? 0
        : Number(closingBalance) + Number(closingAdjustment);
      const effectiveAdjustment = this.adjustment === "" ? 0 : this.adjustment;

      if (this.getCashierAction === "Open")
        return [
          {
            name: "Opening Balance",
            totalAmount: newOpeningBalance,
          },
          {
            name: "Beginning Balance",
            totalAmount: newOpeningBalance + effectiveAdjustment,
          },
        ];

      return [
        {
          name: "Total",
          totalAmount: this.closingBalance,
        },
      ];
    },

    closingBalance() {
      if (!this.currentCashier.session || this.isCurrentCashierSessionless)
        return 0;

      const { beginningBalance, payments } = this.currentCashier.session;

      let paymentTotal = 0;
      if (payments?.length) {
        paymentTotal = payments.reduce(
          (total, payment) => total + Number(payment.totalAmount),
          0
        );
      }

      const closingBalance = Number(beginningBalance) + paymentTotal;
      return closingBalance;
    },
  },
  async created() {
    await this.fetchSessions();
    this.SET_FILTERED_SESSIONS();
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
