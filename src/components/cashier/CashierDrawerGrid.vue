<template>
  <v-container>
    <v-row>
      <v-col v-for="(n, i) in 6" :key="n" cols="12" sm="6" lg="4">
        <CashierDrawer :drawerNumber="n" :isFirstRow="isFirstRow(i)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CashierDrawer from "./CashierDrawer.vue";

export default {
  name: "CashierDrawerGrid",
  components: { CashierDrawer },
  methods: {
    isFirstRow(index) {
      const breakpoint = this.$vuetify.breakpoint.name;
      let row = 3;
      if (breakpoint === "xs") row = 1;
      if (breakpoint === "sm" || breakpoint === "md") row = 2;
      return index < row;
    },
  },
};
</script>
