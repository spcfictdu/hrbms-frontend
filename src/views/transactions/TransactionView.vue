<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />

    <TransactionsTable
      class="mt-10"
      :transactions="transactions"
      @route-event="redirectRoute"
      @onQuery="fetch"
      :loading="getLoading('transactions')"
    />
  </div>
</template>

<script>
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";
import PageHeader from "@/components/headers/PageHeader.vue";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "TransactionView",
  components: { TransactionsTable, PageHeader },
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
    ...mapGetters("transaction", ["getLoading"]),
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
