<template>
  <div>
    <PageHeader :isUpperCase="true" :dividerMarginTop="dividerMarginTop">
      <CashierTerminalActions v-if="$route.name === 'Cashier Terminal'" />
    </PageHeader>
  </div>
</template>

<script>
import PageHeader from "./PageHeader.vue";
import CashierTerminalActions from "../cashier/CashierTerminalActions.vue";

export default {
  name: "CashierHeader",
  components: { PageHeader, CashierTerminalActions },
  props: { dividerMarginTop: Number },
  data: () => ({}),
};
</script>
