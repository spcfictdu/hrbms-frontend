<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader :dividerMarginTop="12" />

    <RouteLoader :target="true" :loaderStyles="['mt-10']" class="mt-4">
      <CashierComponent :session="session" @onSubmit="handleClickEvent" />
    </RouteLoader>
  </div>
</template>

<script>
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierHeader from "@/components/headers/CashierHeader.vue";
import CashierComponent from "@/components/cashier/CashierComponent.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { RouteLoader, CashierHeader, CashierComponent },
  props: { id: String },
  name: "CashierView",
  data: () => ({
    routes: {
      GUEST: {
        RESERVED: "Guest Confirmation",
      },
      ADMIN: {
        RESERVED: "Confirmation",
        CONFIRMED: "CheckInOut",
        CHECKED_OUT: "CheckInOut",
      },
    },
  }),
  methods: {
    ...mapActions("cashier", ["fetchSessions"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapActions("transaction", [
      "createTransaction",
      "updateTransaction",
      "fetchTransaction",
      "setLoading",
    ]),
    ...mapActions("vouchers", ["fetchVouchers"]),
    handleClickEvent(payload) {
      const fn = this.$route.meta.formBtn.title.toUpperCase();
      if (fn === "PRINT") {
        return this.$refs.confirmationForm.handlePrinting();
      }

      // Prefetch the alert function: success, warning errors.
      this.requireAlertFn(2);
      this.setLoading({ key: "form", value: true });

      if (payload.status === "BOOKED") {
        const updatedStatus = payload;
        updatedStatus.status = "CONFIRMED";
        return this.createTransaction(updatedStatus)
          .then((response) => {
            const { status, referenceNumber } = response.data.results;
            const route = this.user
              ? this.routes[this.userRole][status]
              : "Public Dashboard";

            if (this.userRole === "GUEST") this.clearTempData();

            // If user is not logged in, redirect to public dashboard
            this.$router[this.user ? "push" : "replace"]({
              name: route,
              ...(this.user && { params: { referenceNumber } }),
            });
          })
          .catch((err) => {})
          .finally(() => {
            this.setLoading({ key: "form", value: false });
          });
      }
      return this.updateTransaction(payload)
        .then(() => {
          if (payload.status === "RESERVED" || payload.status === "CONFIRMED") {
            this.$router.replace({
              name: "CheckInOut",
              params: { referenceNumber: payload.referenceNumber },
            });
          } else {
            this.fetchTransaction(payload.referenceNumber);
          }
        })
        .catch((err) => {})
        .finally(() => {
          this.setLoading({ key: "form", value: false });
        });
    },
  },
  computed: {
    ...mapGetters("cashier", ["getSession"]),
    session() {
      return this.getSession(this.id);
    },
    user: function () {
      return this.$auth.user();
    },
    userRole: function () {
      return this.$auth.user()?.role;
    },
  },
  created() {
    this.fetchVouchers();
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
