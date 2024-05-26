<template>
  <div
    :class="{
      'xl-padding mt-n8': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3':
        $vuetify.breakpoint.lgAndDown,
    }"
  >
    <TransactionsTable @route-event="pushToTransactionRoute" />
  </div>
</template>

<script>
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";

export default {
  name: "TransactionView",
  components: { TransactionsTable },
  data: () => ({
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
  }),
  methods: {
    pushToTransactionRoute: function (payload) {
      if (this.confirmationRoute.includes(payload.status)) {
        this.$router.push({
          name: "Confirmation",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      } else if (this.checkInCheckOutRoute.includes(payload.status)) {
        this.$router.push({
          name: "CheckInOut",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
