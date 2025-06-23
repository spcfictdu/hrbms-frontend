<template>
  <div>{{ id }} {{ drawerNumber }}</div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
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
    console.log(this.currUserHistory);
  },
};
</script>

<style></style>
