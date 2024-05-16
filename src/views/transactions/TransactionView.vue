<template>
    <div class="px-sm-2 px-lg-13 mt-lg-n3 py-md-8">
        <TransactionsTable />
    </div>
</template>

<script>
import TransactionsTable from '@/components/transactions/TransactionsTable.vue'

export default {
    name: "TransactionView",
    components: { TransactionsTable }
}
</script>

<style scoped>

</style>