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
          Cashier Drawer {{ drawerNumber }} |
          {{ cashierLocation() }}
        </div>
      </template>
      <template>
        <v-btn
          depressed
          class="mr-4"
          color="primary"
          @click="
            $router.push({
              name: 'Billing Report',
              params: {
                transactionRefNum: $route.params.transactionReferenceNumber,
              },
            })
          "
          >Billing</v-btn
        >
      </template>
    </PageHeader>

    <div class="mt-10">
      <v-row>
        <v-col cols="12" md="8" lg="9">
          <CashierTransactionDetailsTable
            :transactionDetails="transaction"
            @menuSelect="handleMenuSelect"
            :loading="loading"
          />
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <CashierTransactionPaymentsTable
            :tableHead="tableHead"
            :mappedItems="mappedItems"
            :loading="loading"
          />
        </v-col>
      </v-row>
    </div>

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
      :loading="getLoading('dialog')"
      @onProceed="handleProceed"
    />
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import CashierTransactionDetailsTable from "@/components/cashier/CashierTransactionDetailsTable.vue";
import CashierTransactionPaymentsTable from "@/components/cashier/CashierTransactionPaymentsTable.vue";
import AdminPasscodeDialog from "@/components/dialogs/AdminPasscodeDialog.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import cashierLocation from "@/mixins/cashier-location";
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "CashierTransactionDetailsView",
  components: {
    PageHeader,
    CashierTransactionDetailsTable,
    CashierTransactionPaymentsTable,
    AdminPasscodeDialog,
    ConfirmationDialog,
  },
  props: {
    id: String,
    drawerNumber: String,
    transactionReferenceNumber: String,
  },
  mixins: [cashierLocation],
  data: () => ({
    itemPayload: null,
    confirmationDialogMeta: {},
  }),
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

      if (!this.transaction) return;

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

      await this.fetchRoom(room);
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
    ...mapState("transaction", ["transaction"]),
    ...mapGetters("transaction", ["getLoading"]),
    ...mapState("cashier", ["dialog"]),
    ...mapState("roomEnum", ["room"]),

    loading() {
      return this.getLoading("transaction") || !this.room;
    },

    tableHead() {
      const totalPayment = this.transaction?.paymentSummary.reduce(
        (total, prev) => total + Number(prev.amountReceived),
        0
      );

      const extraPersonTotal =
        (this.room && this.room.length > 0 && this.room[0]?.extraPersonTotal) ||
        0;

      const totalPurchase =
        this.transaction?.priceSummary.finalRoomTotal +
        extraPersonTotal +
        this.transaction?.priceSummary.fullAddons.reduce((total, addon) => {
          if (addon.paymentStatus === "VOIDED") return total;
          return total + addon.total;
        }, 0);

      const totalBalance = totalPayment - totalPurchase;

      return [
        {
          headerText: "Total Payment",
          value: {
            text: `+${totalPayment?.toFixed(2)}`,
            styles: "cash--text",
          },
        },
        {
          headerText: "Total Balance",
          value: {
            text:
              totalBalance > 0
                ? `+${totalBalance.toFixed(2)}`
                : totalBalance.toFixed(2),
            styles: totalBalance >= 0 ? "cash--text" : "red--text",
          },
        },
      ];
    },

    mappedItems() {
      if (!this.transaction) return [];

      const withAmount = this.transaction?.paymentSummary.filter(
        (p) => p.amountReceived !== "0.00"
      );

      return withAmount.map((p) => ({
        amount: `+${p.amountReceived}`,
        paymentMethod: p.paymentType,
      }));
    },

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
