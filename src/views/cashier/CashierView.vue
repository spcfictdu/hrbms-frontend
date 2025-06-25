<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader :dividerMarginTop="12" />

    <RouteLoader :target="true" :loaderStyles="['mt-10']" class="mt-4">
      <CashierComponent :id="id" />
    </RouteLoader>
  </div>
</template>

<script>
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import CashierHeader from "@/components/headers/CashierHeader.vue";
import CashierComponent from "@/components/cashier/CashierComponent.vue";
export default {
  components: { RouteLoader, CashierHeader, CashierComponent },
  props: { id: String },
  name: "CashierView",
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
