<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader backButton headerText="Cashier History" :dividerMarginTop="36">
      <template #subtitle>
        <div class="d-sm-flex d-none">
          <v-btn
            small
            rounded
            depressed
            :color="activeTab === tab.query ? 'primary' : '#DDE2FE'"
            class="font-weight-bold px-4 mr-1"
            v-for="tab in tabs"
            :key="tab.query"
            @click="handleTabChange(tab.query)"
            >{{ tab.title }}</v-btn
          >
        </div>
        <div class="d-sm-none" :style="{ maxWidth: '220px' }">
          <v-select
            filled
            rounded
            dense
            hide-details
            :items="tabs"
            item-text="title"
            item-value="query"
            :value="activeTab"
            @change="handleTabChange($event)"
          ></v-select>
        </div>
      </template>
    </PageHeader>

    <RouteLoader :target="hasData" class="mt-10">
      <keep-alive>
        <component
          :is="currentTabComponent"
          :transactions="transactions"
          :history="history"
          :tableHeaders="tableHeaders"
          @paymentsQuery="getTab('payment').fetch($event)"
          :fetchingTab="getTab(activeTab)"
          @route-event="redirectRoute"
          @onQuery="getTab('transaction').fetch($event)"
          keep
        />
      </keep-alive>
    </RouteLoader>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";
import CashierHistoryTable from "@/components/cashier/CashierHistoryTable.vue";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: {
    RouteLoader,
    PageHeader,
    CashierHistoryTable,
    TransactionsTable,
  },
  name: "CashierTransactionListView",
  props: { id: String, drawerNumber: String },
  data() {
    return {
      tabs: [
        {
          query: "transaction",
          title: "Transaction",
          component: "TransactionsTable",
          fetch: (queryParams = {}) => {
            this.fetchTransactions(queryParams);
          },
        },
        {
          query: "payment",
          title: "Payment",
          component: "CashierHistoryTable",
          fetch: (queryParams = {}) => {
            this.fetchHistory({ userId: this.id, queryParams });
          },
        },
        {
          query: "adjustment",
          title: "Adjustment",
          component: "CashierHistoryTable",
          fetch: () => {
            this.fetchAdjustments({ sortBy: "openedAt", sortOrder: "desc" });
          },
        },
      ],
    };
  },
  methods: {
    ...mapActions("cashier", ["fetchHistory", "fetchAdjustments"]),
    ...mapActions("transaction", ["fetchTransactions"]),
    ...mapMutations("cashier", ["SET_ADJUSTMENTS", "SET_CURR_USER_HISTORY"]),
    getTab(tabQuery) {
      if (!tabQuery) return this.tabs[0];
      return this.tabs.find((t) => t.query === tabQuery);
    },
    redirectRoute(row) {
      this.$router.push({
        name: "Cashier Transaction Details",
        params: {
          ...this.$route.params,
          transactionReferenceNumber: String(row.referenceNumber),
        },
        query: {
          mode: "edit",
        },
      });
    },
    handleTabChange(tabQuery) {
      this.fetchTab(tabQuery);

      if (this.activeTab === tabQuery) return;

      this.$router.push({
        query: { ...this.$route.query, tab: tabQuery },
      });
    },
    async fetchTab(newTab) {
      const tab = this.getTab(newTab);
      await tab.fetch();
    },
  },
  computed: {
    ...mapState("cashier", ["currUserHistory", "adjustments"]),
    ...mapState("transaction", ["transactions"]),
    activeTab() {
      return this.$route.query.tab || this.getTab().query;
    },
    currentTabComponent() {
      return this.getTab(this.activeTab).component;
    },
    history() {
      if (this.activeTab === "payment") {
        return this.currUserHistory?.data ? this.currUserHistory : {};
      }
      return this.adjustments.length ? this.adjustments : [];
    },
    hasData() {
      if (this.activeTab === "transaction") {
        return !!this.transactions;
      }
      if (this.activeTab === "payment") {
        return !!this.currUserHistory;
      }
      return !!this.adjustments.length;
    },
    tableHeaders() {
      return [
        {
          text: "Employee",
          value: "employee",
          width: "180px",
        },
        ...(this.activeTab === "payment"
          ? [
              {
                text: "MOP",
                value: "MOP",
              },
              {
                text: "Guest Name",
                value: "guestName",
              },
              {
                text: "Total Payment",
                value: "totalPayment",
              },
              {
                text: "Discount",
                value: "discount",
              },
            ]
          : [
              {
                text: "Opening Adjustment",
                value: "openingAdjustment",
              },
              {
                text: "Beginning Balance",
                value: "beginningBalance",
              },
              {
                text: "Opening Balance",
                value: "openingBalance",
              },
              {
                text: "Closing Balance",
                value: "closingBalance",
              },
            ]),

        {
          text: "Refund",
          value: "refund",
        },
        {
          text: "Voided",
          value: "voided",
        },
        {
          text: "Time",
          value: "time",
        },
      ];
    },
  },
  created() {
    this.getTab(this.activeTab).fetch();
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
