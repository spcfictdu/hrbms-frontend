<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader />

    <RouteLoader :target="true" :loaderStyles="['mt-10']">
      <CashierDrawerGrid />
    </RouteLoader>
  </div>
</template>

<script>
import CashierHeader from "@/components/headers/CashierHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierDrawerGrid from "@/components/cashier/CashierDrawerGrid.vue";
import { mapActions } from "vuex";

export default {
  name: "CashierView",
  components: { CashierHeader, RouteLoader, CashierDrawerGrid },
  methods: {
    ...mapActions("cashier", ["fetchSessions"]),
  },
  created() {
    this.fetchSessions();
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
