<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader :dividerMarginTop="48" />

    <RouteLoader :target="hasData" :loaderStyles="['mt-10']">
      <CashierDrawerGrid />
    </RouteLoader>
  </div>
</template>

<script>
import CashierHeader from "@/components/headers/CashierHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierDrawerGrid from "@/components/cashier/CashierDrawerGrid.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "CashierView",
  components: { CashierHeader, RouteLoader, CashierDrawerGrid },
  methods: {
    ...mapActions("cashier", ["fetchSessions"]),
  },
  computed: {
    ...mapState("cashier", ["sessions"]),
    hasData() {
      return !!this.sessions ?? false;
    },
    user() {
      return this.$auth.user();
    },
    userRole() {
      return this.$auth.user()?.role;
    },
  },
  async created() {
    await this.fetchSessions();

    if (!this.user || this.userRole !== "FRONT DESK") return;
    const userFullName = `${this.$auth.user().firstName} ${
      this.$auth.user().lastName
    }`;
    const userId = this.sessions.find(
      (s) => s.userFullName === userFullName
    ).userId;

    this.$router.replace({ name: "Cashier", params: { id: String(userId) } });
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
