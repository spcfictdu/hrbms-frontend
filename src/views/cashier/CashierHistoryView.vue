<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader headerText="Transactions">
      <template #subtitle>
        <p>Cashier Drawer {{ drawerNumber }} | First Floor Lobby</p>
      </template>
    </PageHeader>

    <RouteLoader :target="true" class="mt-10">
      <CashierHistoryTable :history="currUserHistory" />
    </RouteLoader>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierHistoryTable from "@/components/cashier/CashierHistoryTable.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: { RouteLoader, PageHeader, CashierHistoryTable },
  name: "CashierHistoryView",
  props: { id: String, drawerNumber: String },
  methods: {
    ...mapActions("cashier", ["fetchHistory"]),
  },
  computed: {
    ...mapState("cashier", ["currUserHistory"]),
  },
  async created() {
    await this.fetchHistory(this.id);
  },
};
</script>

<style></style>
