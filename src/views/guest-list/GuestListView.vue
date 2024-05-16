<template>
    <div class="px-sm-2 px-lg-13 mt-lg-n3 py-md-8">
        <GuestListTable />
    </div>
</template>

<script>
import GuestListTable from '@/components/guests/GuestListTable.vue';
export default {
    name: "GuestListView",
    components: {GuestListTable}
}
</script>

<style scoped>

</style>