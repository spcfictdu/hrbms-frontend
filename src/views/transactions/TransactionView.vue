<template>
  <div
    :class="{
      'xl-padding mt-n8': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3': $vuetify.breakpoint.lgAndDown,
    }"
  >
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
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
