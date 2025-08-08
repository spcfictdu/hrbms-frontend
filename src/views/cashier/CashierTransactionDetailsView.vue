<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader headerText="Transactions">
      <template #subtitle>
        <p class="grey--text text--darken-2">
          Cashier Drawer {{ drawerNumber }} | First Floor Lobby
        </p>
      </template>
    </PageHeader>

    <RouteLoader :target="hasData" class="mt-10">
      <CashierTransactionDetailsTable
        :transactionDetails="transaction"
        :headerDetails="headerDetails"
      />
    </RouteLoader>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierTransactionDetailsTable from "@/components/cashier/CashierTransactionDetailsTable.vue";
import { mapActions, mapState } from "vuex";
import { format, parseISO } from "date-fns";

export default {
  components: { RouteLoader, PageHeader, CashierTransactionDetailsTable },
  name: "CashierTransactionDetailsView",
  props: {
    id: String,
    drawerNumber: String,
    transactionReferenceNumber: String,
  },
  methods: {
    ...mapActions("cashier", ["fetchHistory"]),
    ...mapActions("transaction", ["fetchTransaction"]),
    async fetch() {
      await this.fetchTransaction(this.transactionReferenceNumber);
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
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
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
