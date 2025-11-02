<template>
  <div class="mt-10">
    <TransactionSkeleton v-if="loading" />
    <ConfirmationForm
      v-else
      ref="confirmationForm"
      @cancel="handleCancel"
      @confirmReservation="handleConfirmReservation"
      @print="handlePrint"
      :cashierUserId="cashierUserId"
      :value="transaction"
    />
  </div>
</template>

<script>
import TransactionSkeleton from "@/components/skeleton-loaders/TransactionSkeleton.vue";
import ConfirmationForm from "@/components/hotel-rooms/forms/ConfirmationForm.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "ConfirmationView",
  components: {
    TransactionSkeleton,
    ConfirmationForm,
  },
  props: {
    referenceNumber: String,
  },
  data: () => ({
    cashierUserId: null,
    cancelRoutes: {
      GUEST: "Guest Account Details",
      ADMIN: "Transactions",
      "FRONT DESK": "Transactions",
    },
  }),
  async created() {
    await this.fetch();

    if (
      !this.user ||
      (this.userRole !== "ADMIN" && this.userRole !== "FRONT DESK")
    ) {
      return;
    }

    // const userFullName = `${this.$auth.user().firstName} ${
    //   this.$auth.user().lastName
    // }`;
    this.cashierUserId = this.sessions.find((s) => {
      if (this.userRole === "ADMIN") return s.status === "ACTIVE";
      // return s.userFullName === userFullName && s.status === "ACTIVE";
      return s.userId === this.$auth.user().userId && s.status === "ACTIVE";
    })?.userId;
  },
  methods: {
    ...mapActions("transaction", [
      "fetchTransaction",
      "deleteReservation",
      "updateTransaction",
      "setLoading",
      "fetchFlights",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapActions("cashier", ["fetchSessions"]),
    async fetch() {
      await Promise.all([
        this.fetchTransaction(this.referenceNumber),
        this.fetchFlights(this.referenceNumber),
      ]);

      if (this.userRole === "ADMIN" || this.userRole === "FRONT DESK")
        await this.fetchSessions();
    },
    handleCancel(payload) {
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

    handlePrint() {
      const fn = this.$route.meta.formBtn.title.toUpperCase();
      if (fn === "PRINT") {
        return this.$refs.confirmationForm.handlePrinting();
      }
    },

    handleConfirmReservation() {
      if (!this.cashierUserId) {
        this.$router.push({ name: "Cashier Terminal" });
      } else {
        this.$router.push({
          name: "Cashier",
          params: { id: String(this.cashierUserId) },
        });
      }

      this.fetchTransaction(this.referenceNumber);

      // // Prefetch the alert function: success, warning errors.
      // this.requireAlertFn(2);
      // this.setLoading({ key: "form", value: true });

      // return this.updateTransaction(payload)
      //   .then(() => {
      //     if (payload.status === "RESERVED") {
      //       this.$router.replace({
      //         name: "CheckInOut",
      //         params: { referenceNumber: payload.referenceNumber },
      //       });
      //     } else {
      //       this.fetchTransaction(payload.referenceNumber);
      //     }
      //   })
      //   .catch((err) => {})
      //   .finally(() => {
      //     this.setLoading({ key: "form", value: false });
      //   });
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    ...mapState("cashier", ["sessions"]),
    ...mapGetters("transaction", ["getLoading"]),

    loading() {
      return this.getLoading("transaction") && !this.transaction;
    },

    userRole() {
      return this.$auth.user().role;
    },

    user() {
      return this.$auth.user();
    },
  },
};
</script>

<style scoped></style>
