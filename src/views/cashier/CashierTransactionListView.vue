<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader headerText="Transactions" :dividerMarginTop="36">
      <template #subtitle>
        <v-btn
          small
          :rounded="activeTabIndex !== index"
          depressed
          :color="activeTabIndex === index ? 'primary' : '#DDE2FE'"
          :style="activeTabIndex === index ? borderRadius(index) : {}"
          class="font-weight-bold px-4 mr-1"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="() => handleTabClick(index)"
          >{{ tab.title }}</v-btn
        >
        <!-- <p class="grey--text text--darken-2">
          Cashier Drawer {{ drawerNumber }} | First Floor Lobby
        </p> -->
      </template>
    </PageHeader>

    <RouteLoader :target="hasData" class="mt-10">
      <CashierHistoryTable
        :history="history"
        :tableHeaders="tableHeaders"
        @query="handleQuery"
        :fetchingTab="tabs[activeTabIndex]"
      />
    </RouteLoader>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierHistoryTable from "@/components/cashier/CashierHistoryTable.vue";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: { RouteLoader, PageHeader, CashierHistoryTable },
  name: "CashierTransactionListView",
  props: { id: String, drawerNumber: String },
  data: () => ({
    tabs: [{ title: "Payment" }, { title: "Adjustment" }],
    activeTabIndex: 0,
  }),
  methods: {
    ...mapActions("cashier", ["fetchHistory", "fetchAdjustments"]),
    ...mapMutations("cashier", ["SET_ADJUSTMENTS", "SET_CURR_USER_HISTORY"]),
    handleQuery(queryParams = {}) {
      // if (this.activeTabIndex === 1) return;
      return this.fetchHistory({ userId: this.id, queryParams });
    },
    borderRadius(index) {
      const defaultBorder = "10px";
      const roundedBorder = "28px";
      if (index === 0) {
        return {
          borderRadius: `${roundedBorder} ${defaultBorder}  ${defaultBorder} ${roundedBorder}`,
        };
      }
      return {
        borderRadius: `${defaultBorder} ${roundedBorder} ${roundedBorder} ${defaultBorder}`,
      };
    },
    handleTabClick(index) {
      this.activeTabIndex = index;
    },
  },
  computed: {
    ...mapState("cashier", ["currUserHistory", "adjustments"]),
    history() {
      if (this.activeTabIndex === 0) {
        return this.currUserHistory?.data ? this.currUserHistory : {};
      }
      return this.adjustments.length ? this.adjustments : [];
    },
    hasData() {
      if (this.activeTabIndex === 0) {
        return !!this.currUserHistory ?? false;
      }
      return !!this.adjustments.length ?? false;
    },
    tableHeaders() {
      return [
        {
          text: "Employee",
          value: "employee",
          width: "180px",
        },
        ...(this.activeTabIndex === 0
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
  async created() {
    await Promise.all([
      this.fetchHistory({ userId: this.id }),
      this.fetchAdjustments({ sortBy: "openedAt", sortOrder: "desc" }),
    ]);
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
