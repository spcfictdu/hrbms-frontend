<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <CashierHeader />
  </div>
</template>

<script>
import CashierHeader from "@/components/headers/CashierHeader.vue";

export default {
  name: "CashierView",
  components: { CashierHeader },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
