<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(session, i) in sessions"
        :key="session.userId"
        cols="12"
        sm="6"
        lg="4"
      >
        <CashierDrawer
          :drawerNumber="i + 1"
          :isFirstRow="isFirstRow(i)"
          :sessionData="session"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CashierDrawer from "./CashierDrawer.vue";
import { mapState } from "vuex";

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
  computed: {
    ...mapState("cashier", ["sessions"]),
  },
};
</script>
