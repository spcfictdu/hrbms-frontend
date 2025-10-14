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
          <CashierPaymentDetailsTable :data="payment" />
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <CashierTransactionPaymentsTable
            :tableHead="tableHead"
            :mappedItems="mappedItems"
          />
        </v-col>
      </v-row>
    </RouteLoader>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierPaymentDetailsTable from "@/components/cashier/CashierPaymentDetailsTable.vue";
import CashierTransactionPaymentsTable from "@/components/cashier/CashierTransactionPaymentsTable.vue";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: {
    RouteLoader,
    PageHeader,
    CashierPaymentDetailsTable,
    CashierTransactionPaymentsTable,
  },
  name: "CashierPaymentDetailsView",
  data: () => ({
    itemPayload: null,
    confirmationDialogMeta: {},
  }),
  props: {
    id: String,
    drawerNumber: String,
    transactionReferenceNumber: String,
    paymentId: String,
  },
  methods: {
    ...mapActions("transaction", ["fetchPayment"]),
    ...mapMutations("transaction", ["SET_PAYMENT"]),

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
    ...mapState("transaction", ["payment", "loading"]),

    tableHead() {
      if (!this.payment) return [];

      return [
        {
          headerText: "Total Purchase",
          value: {
            text: this.payment.totalPurchase,
          },
        },
      ];
    },

    mappedItems() {
      if (!this.payment) return [];

      return [
        {
          amount: `+${this.payment.totalPurchase}`,
          paymentMethod: this.payment.paymentType,
        },
      ];
    },

    headerText() {
      const mode = this.$route.query.mode;
      const isEditMode = mode === "edit";

      return `${isEditMode ? "Transaction" : "Payment"} Details`;
    },

    hasData() {
      return !!this.payment ?? false;
    },
  },
  created() {
    this.fetchPayment({
      referenceNumber: this.transactionReferenceNumber,
      paymentId: Number(this.paymentId),
    });
  },
  beforeDestroy() {
    this.SET_PAYMENT(null);
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
