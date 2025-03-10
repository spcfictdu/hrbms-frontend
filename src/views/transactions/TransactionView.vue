<template>
  <div
    :class="{
      'xl-padding mt-n8': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3':
        $vuetify.breakpoint.lgAndDown,
    }"
  >
    <RouteLoader :target="hasData">
      <TransactionsTable
        :transactions="transactions"
        @route-event="redirectRoute"
        @query_params="fetch"
      />
    </RouteLoader>
  </div>
</template>

<script>
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "TransactionView",
  components: { TransactionsTable, RouteLoader },
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
  padding: 0 288px 0 288px;
}
</style>
