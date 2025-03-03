<template>
  <div class="mt-10">
    <RouteLoader :target="hasData">
      <confirmation-form
        @onCancel="handleCancel"
        @onSubmit="handleUpdate"
        :value="transaction"
      />
    </RouteLoader>
  </div>
</template>

<script>
import ConfirmationForm from "../../../components/hotel-rooms/forms/ConfirmationForm.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "ConfirmationView",
  components: {
    ConfirmationForm,
    RouteLoader,
  },
  props: {
    referenceNumber: String,
  },
  created: function () {
    this.fetch();
  },
  methods: {
    ...mapActions("transaction", [
      "fetchTransaction",
      "deleteReservation",
      "updateTransaction",
    ]),
    fetch: async function () {
      await this.fetchTransaction(this.referenceNumber);
    },
    handleCancel: function (payload) {
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
    handleUpdate: function (payload) {
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
    hasData: function () {
      return !!this.transaction ?? false;
    },
  },
};
</script>

<style scoped></style>
