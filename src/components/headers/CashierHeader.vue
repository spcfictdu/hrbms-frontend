<template>
  <div>
    <PageHeader
      headerText="Cashier Terminal"
      :isUpperCase="true"
      :dividerMarginTop="48"
    >
      <CashierTerminalActions />
    </PageHeader>
  </div>
</template>

<script>
import PageHeader from "./PageHeader.vue";
import CashierTerminalActions from "../cashier/CashierTerminalActions.vue";

export default {
  name: "CashierHeader",
  components: { PageHeader, CashierTerminalActions },
  data: () => ({}),
};
</script>
