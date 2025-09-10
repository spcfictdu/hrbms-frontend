<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader backButton headerText="Transactions" :dividerMarginTop="18">
      <template #subtitle>
        <div class="grey--text text--darken-2 mb-1">
          Cashier Drawer {{ drawerNumber }} | First Floor Lobby
        </div>
      </template>
    </PageHeader>

    <RouteLoader :target="hasData" class="mt-10">
      <CashierTransactionDetailsTable
        :transactionDetails="transaction"
        :headerDetails="headerDetails"
        @menuSelect="handleMenuSelect"
      />
    </RouteLoader>

    <AdminPasscodeDialog
      :opened="dialog.adminPasscode"
      :onClose="() => handleClose('adminPasscode')"
      :meta="{}"
      @valid="handleValid"
    />

    <ConfirmationDialog
      :opened="dialog.confirmation"
      :onClose="() => handleClose('confirmation')"
      :meta="confirmationDialogMeta"
      :loading="loading.dialog"
      @onProceed="handleProceed"
    />
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierTransactionDetailsTable from "@/components/cashier/CashierTransactionDetailsTable.vue";
import AdminPasscodeDialog from "@/components/dialogs/AdminPasscodeDialog.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import { mapMutations, mapActions, mapState } from "vuex";
import { format, parseISO } from "date-fns";

export default {
  components: {
    RouteLoader,
    PageHeader,
    CashierTransactionDetailsTable,
    AdminPasscodeDialog,
    ConfirmationDialog,
  },
  name: "CashierTransactionDetailsView",
  data: () => ({
    itemPayload: null,
    confirmationDialogMeta: {},
  }),
  props: {
    id: String,
    drawerNumber: String,
    transactionReferenceNumber: String,
  },
  methods: {
    ...mapActions("cashier", ["fetchHistory"]),
    ...mapActions("transaction", ["fetchTransaction", "updateTransaction"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapMutations("transaction", ["SET_TRANSACTION"]),
    ...mapMutations("cashier", ["SET_DIALOG"]),

    handleMenuSelect(payload) {
      this.initializeUpdateData(payload);
    },

    initializeUpdateData({ payload, confirmationDialogMeta }) {
      this.itemPayload = payload;
      this.confirmationDialogMeta = confirmationDialogMeta;
    },

    handleClose(dialog) {
      this.SET_DIALOG({ key: dialog, value: false });
    },

    handleValid() {
      this.SET_DIALOG({ key: "confirmation", value: true });
    },

    async handleProceed() {
      await this.handleTransactionUpdate(this.itemPayload);
      this.itemPayload = null;
      this.handleClose("confirmation");
    },

    async fetch() {
      await this.fetchTransaction(this.transactionReferenceNumber);
    },

    async handleTransactionUpdate(payload) {
      this.requireAlertFn(2);

      try {
        await this.updateTransaction({
          referenceNumber: this.transactionReferenceNumber,
          cashierId: Number(this.id),
          ...payload,
        });

        this.fetchTransaction(this.transactionReferenceNumber);
      } catch (err) {
        console.error(err);
      }
    },
  },
  computed: {
    ...mapState("transaction", ["transaction", "loading"]),
    ...mapState("cashier", ["dialog"]),

    hasData() {
      return !!this.transaction ?? false;
    },
    headerDetails() {
      const totalPayment = this.transaction?.paymentSummary
        .reduce((total, prev) => total + Number(prev.amountReceived), 0)
        .toFixed(2);

      return {
        guestName: this.transaction?.guestName,
        referenceNumber: this.transactionReferenceNumber,
        totalPayment,
        date:
          this.transaction &&
          format(
            parseISO(this.transaction.transaction.createdAt),
            "MMMM dd, yyyy"
          ),
      };
    },
  },
  created() {
    this.fetch();
  },
  beforeDestroy() {
    this.SET_TRANSACTION(null);
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
