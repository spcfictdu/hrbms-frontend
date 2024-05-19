<template>
  <div>
    <TransactionsTable />
  </div>
</template>

<script>
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";

export default {
  name: "TransactionView",
  components: { TransactionsTable },
};
</script>

<style scoped>
</style>
