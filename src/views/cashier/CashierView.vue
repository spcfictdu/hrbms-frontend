<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader :dividerMarginTop="12" />

    <RouteLoader :target="true" :loaderStyles="['mt-10']" class="mt-4">
      <CashierComponent :session="session" />
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
  methods: {
    ...mapActions("cashier", ["fetchSessions"]),
  },
  computed: {
    ...mapGetters("cashier", ["getSession"]),
    session() {
      return this.getSession(this.id);
    },
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
