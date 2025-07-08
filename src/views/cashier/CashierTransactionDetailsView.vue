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

    <RouteLoader :target="true" class="mt-10">
      <CashierTransactionDetailsTable
        :transactionDetails="transactionDetails"
      />
    </RouteLoader>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierTransactionDetailsTable from "@/components/cashier/CashierTransactionDetailsTable.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: { RouteLoader, PageHeader, CashierTransactionDetailsTable },
  name: "CashierTransactionDetailsView",
  props: { id: String, drawerNumber: String, transactionId: String },
  methods: {
    ...mapActions("cashier", ["fetchHistory"]),
    async fetch(queryParams = {}) {
      await this.fetchHistory({ userId: this.id, queryParams });
    },
  },
  computed: {
    ...mapState("cashier", ["currUserHistory"]),
    hasData() {
      return !!this.currUserHistory ?? false;
    },
    transactionDetails() {
      return;
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
