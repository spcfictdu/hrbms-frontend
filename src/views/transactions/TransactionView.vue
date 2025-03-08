<template>
  <div
    :class="{
      'xl-padding mt-n8': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3':
        $vuetify.breakpoint.lgAndDown,
    }"
  >
    <v-alert
      :value="isShowAlert"
      :type="handleAlertType"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ transactionStatus.message ?? transactionStatus.message }}
    </v-alert>
    <TransactionsTable
      :transactions="transactions"
      @route-event="pushToTransactionRoute"
      @query_params="triggerPagination"
      v-if="transactions"
    />
  </div>
</template>

<script>
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "TransactionView",
  components: { TransactionsTable },
  data: () => ({
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
    isShowAlert: false,
  }),
  computed: {
    ...mapState("transaction", {
      transactions: "transactions",
    }),
    ...mapState("transaction", {
      transactionStatus: "transactionStatus",
      transactions: "transactions",
    }),
    handleAlertType() {
      return this.transactionStatus.status !== ""
        ? this.transactionStatus.status.toLowerCase()
        : "success";
    },
  },
  methods: {
    ...mapActions("transaction", ["fetchTransactions"]),
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
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
    triggerPagination: function (query_params) {
      this.fetchTransactions(query_params);
    },
  },
  watch: {
    transactionStatus: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (
          newVal.status.toLowerCase() === "success" ||
          newVal.status.toLowerCase() === "error"
        ) {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            newVal.status = "";
            newVal.message = "";
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
  created() {
    this.fetchTransactions()
  }
};
</script>

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
