<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />
    <RouteLoader :target="hasData" class="mt-10">
      <TransactionsTable
        :transactions="transactions"
        @route-event="redirectRoute"
        @onQuery="fetch"
      />
    </RouteLoader>
  </div>
</template>

<script>
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import PageHeader from "@/components/headers/PageHeader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "TransactionView",
  components: { TransactionsTable, RouteLoader, PageHeader },
  data: () => ({
    routeNames: {
      RESERVED: "Confirmation",
      CONFIRMED: "CheckInOut",
      "CHECKED-IN": "CheckInOut",
      "CHECKED-OUT": "CheckInOut",
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    ...mapActions("transaction", ["fetchTransactions"]),
    fetch: async function (query_params = {}) {
      await this.fetchTransactions(query_params);
    },
    redirectRoute: function (payload) {
      this.$router.push({
        name: this.routeNames[payload.status],
        params: {
          referenceNumber: payload.referenceNumber,
        },
      });
    },
  },
  computed: {
    ...mapState("transaction", ["transactions"]),
    ...mapState("transaction", ["transactions"]),
    hasData: function () {
      return !!this.transactions ?? false;
    },
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
