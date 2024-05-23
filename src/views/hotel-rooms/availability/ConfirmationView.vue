<template>
  <div class="mt-10">
    <confirmation-form
      @delete-event="requestDelete"
      :result="transaction"
      v-if="transaction"
    />
  </div>
</template>

<script>
import ConfirmationForm from "../../../components/hotel-rooms/availability/ConfirmationForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "ConfirmationView",
  components: {
    ConfirmationForm,
  },
  methods: {
    ...mapActions("transaction", ["fetchTransaction", "deleteReservation"]),
    fetchData: function () {
      const referenceNumber = this.$route.params.referenceNumber;
      this.fetchTransaction(referenceNumber);
    },
    requestDelete: function (payload) {
      this.deleteReservation({
        status: payload.status,
        transactionRefNum: payload.transactionRefNum,
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
