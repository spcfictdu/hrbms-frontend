<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader backButton :headerText="headerText" :dividerMarginTop="18">
      <template #subtitle>
        <div class="grey--text text--darken-2 mb-1">
          Cashier Drawer {{ drawerNumber }} | First Floor Lobby
        </div>
      </template>
    </PageHeader>

    <RouteLoader :target="hasData" class="mt-10">
      <v-row>
        <v-col cols="12" md="8" lg="9">
          <CashierTransactionDetailsTable
            :transactionDetails="transaction"
            @menuSelect="handleMenuSelect"
          />
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <CashierTransactionPaymentsTable
            :transactionDetails="transaction"
            :payments="transaction?.paymentSummary"
          />
        </v-col>
      </v-row>
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
import CashierTransactionPaymentsTable from "@/components/cashier/CashierTransactionPaymentsTable.vue";
import AdminPasscodeDialog from "@/components/dialogs/AdminPasscodeDialog.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  components: {
    RouteLoader,
    PageHeader,
    CashierTransactionDetailsTable,
    CashierTransactionPaymentsTable,
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
    ...mapActions("roomEnum", ["fetchRoom"]),

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

      const room = {
        roomType: this.transaction.room.name,
        roomNumber: this.transaction.room.number,
        roomPaymentStatus: this.transaction.transaction.paymentStatus,
        dateRange: [
          this.transaction.transaction.checkInDate,
          this.transaction.transaction.checkOutDate,
        ],
        extraPersonCount: this.transaction.transaction.extraPerson,
        discount: this.transaction.priceSummary.discountName,
      };

      if (this.transaction.priceSummary.fullAddons.length) {
        room.addons = this.transaction.priceSummary.fullAddons.map(
          ({ name, quantity }) => `${name}-${quantity}`
        );
      }

      if (!this.transaction.priceSummary.discountName) {
        this.$delete(room, "discount");
        this.$delete(room, "voucherCode");
      }

      if (this.transaction.priceSummary.discountName === "VOUCHER") {
        room.voucherCode = this.transaction.priceSummary.voucherCode;
      }

      this.fetchRoom(room);
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

    headerText() {
      const mode = this.$route.query.mode;
      const isEditMode = mode === "edit";

      return `${isEditMode ? "Transaction" : "Payment"} Details`;
    },

    hasData() {
      return !!this.transaction ?? false;
    },
  },
  async created() {
    await this.fetch();
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
