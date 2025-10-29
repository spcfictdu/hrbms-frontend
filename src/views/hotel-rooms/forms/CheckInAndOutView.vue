<template>
  <div class="mt-10">
    <TransactionSkeleton transaction v-if="loading" />
    <ConfirmedDetails
      v-else
      @update-event="handleUpdate"
      :value="transaction"
    />
  </div>
</template>

<script>
import TransactionSkeleton from "@/components/skeleton-loaders/TransactionSkeleton.vue";
import ConfirmedDetails from "@/components/hotel-rooms/forms/ConfirmedDetails.vue";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "CheckInAndOut",
  components: {
    TransactionSkeleton,
    ConfirmedDetails,
  },
  props: {
    referenceNumber: String,
  },
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("transaction", [
      "fetchTransaction",
      "updateTransaction",
      "setLoading",
      "fetchFlights",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch() {
      Promise.all([
        this.fetchTransaction(this.referenceNumber),
        this.fetchFlights(this.referenceNumber),
      ]);
    },
    handleUpdate: function (payload) {
      // Prefetch the alert function: success, error
      this.requireAlertFn(2);
      this.setLoading({ key: "header", value: true });

      this.updateTransaction(payload)
        .then(() => {
          this.fetchTransaction(payload.referenceNumber);
        })
        .catch((err) => {})
        .finally(() => {
          this.setLoading({ key: "header", value: false });
        });
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    ...mapGetters("transaction", ["getLoading"]),

    loading() {
      return this.getLoading("transaction");
    },
  },
};
</script>

<style scoped></style>
