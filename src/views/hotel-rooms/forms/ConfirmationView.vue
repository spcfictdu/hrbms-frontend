<template>
  <div class="mt-10">
    <confirmation-form
      @delete-event="requestDelete"
      @validation-event="requestUpdate"
      :result="transaction"
      v-if="transaction"
    />
  </div>
</template>

<script>
import ConfirmationForm from "../../../components/hotel-rooms/forms/ConfirmationForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "ConfirmationView",
  components: {
    ConfirmationForm,
  },
  methods: {
    ...mapActions("transaction", [
      "fetchTransaction",
      "deleteReservation",
      "updateTransaction",
    ]),
    fetchData: function () {
      const referenceNumber = this.$route.params.referenceNumber;
      this.fetchTransaction(referenceNumber);
    },
    requestDelete: function (payload) {
      this.deleteReservation({
        status: payload.status,
        transactionRefNum: payload.transactionRefNum,
      })
        .then(() => {
          this.$router.replace({
            name: "Transactions",
          });
        })
        .catch(() => {
          this.$router.push({
            name: "Transactions",
          });
        });
    },
    requestUpdate: function (payload) {
      this.updateTransaction(payload).then(() => {
        if (payload.status === "RESERVED") {
          this.$router.push({
            name: "CheckInOut",
            params: { referenceNumber: payload.referenceNumber },
          });
        } else {
          this.fetchTransaction(payload.referenceNumber);
        }
      });
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
