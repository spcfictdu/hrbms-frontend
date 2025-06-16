<template>
  <v-container>
    <v-row>
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
        <CashierDrawer :drawerNumber="n" :isFirstRow="n <= 3" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CashierDrawer from "./CashierDrawer.vue";

export default {
  name: "CashierDrawerGrid",
  components: { CashierDrawer },
};
</script>
