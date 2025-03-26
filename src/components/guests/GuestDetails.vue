<template>
  <div>
    <GuestInfo :guest="guest" class="mb-5" />

    <GuestTransactionsTable
      :guest="guest"
      @onQuery="$emit('onQuery', $event)"
    />
  </div>
</template>

<script>
import GuestInfo from "./GuestInfo.vue";
import GuestTransactionsTable from "../tables/variants/GuestTransactionsTable.vue";
export default {
  name: "GuestDetails",
  components: {
    GuestInfo,
    GuestTransactionsTable,
  },
  props: {
    guest: Object,
  },
  data: () => ({}),
};
</script>

<style scoped></style>
