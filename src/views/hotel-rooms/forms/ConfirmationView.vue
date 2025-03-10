<template>
  <div class="mt-10">
    <RouteLoader :target="hasData">
      <confirmation-form
        ref="confirmationForm"
        @onCancel="handleCancel"
        @onSubmit="handleClickEvent"
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
  data: () => ({
    cancelRoutes: {
      GUEST: "Guest Account Details",
      ADMIN: "Transactions",
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    ...mapActions("transaction", [
      "fetchTransaction",
      "deleteReservation",
      "updateTransaction",
      "setLoading",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch: async function () {
      await this.fetchTransaction(this.referenceNumber);
    },
    handleCancel: function (payload) {
      // Prefetch the alert function: success, warning errors.
      this.requireAlertFn(2);
      this.setLoading({ key: "cancel", value: true });

      this.deleteReservation({
        status: payload.status,
        transactionRefNum: payload.transactionRefNum,
      })
        .then(() => {
          this.$router.replace({
            name: this.cancelRoutes[this.userRole],
          });
        })
        .finally(() => {
          this.setLoading({ key: "cancel", value: false });
        });
    },
    handleClickEvent: function (payload) {
      const fn = this.$route.meta.formBtn.title.toUpperCase();
      if (fn === "PRINT") {
        return this.$refs.confirmationForm.handlePrinting();
      }

      // Prefetch the alert function: success, warning errors.
      this.requireAlertFn(2);
      this.setLoading({ key: "form", value: true });

      return this.updateTransaction(payload)
        .then(() => {
          if (payload.status === "RESERVED") {
            this.$router.push({
              name: "CheckInOut",
              params: { referenceNumber: payload.referenceNumber },
            });
          } else {
            this.fetchTransaction(payload.referenceNumber);
          }
        })
        .finally(() => {
          this.setLoading({ key: "form", value: false });
        });
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    hasData: function () {
      return !!this.transaction ?? false;
    },
    userRole: function () {
      return this.$auth.user().role;
    },
  },
};
</script>

<style scoped></style>
