<template>
  <v-container>
    <v-row v-if="loading">
      <v-col v-for="(n, i) in 6" :key="n" cols="12" sm="6" lg="4">
        <CashierDrawerSkeleton :isFirstRow="isFirstRow(i)" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="(session, i) in filteredSessions"
        :key="session.cashierId"
        cols="12"
        sm="6"
        lg="4"
      >
        <CashierDrawer
          :drawerNumber="session.cashierId"
          :isFirstRow="isFirstRow(i)"
          :sessionData="session"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CashierDrawerSkeleton from "@/components/skeleton-loaders/CashierDrawerSkeleton.vue";
import CashierDrawer from "./CashierDrawer.vue";
import { mapState } from "vuex";

export default {
  name: "CashierDrawerGrid",
  components: { CashierDrawerSkeleton, CashierDrawer },
  props: {
    loading: Boolean,
  },
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
    ...mapState("cashier", ["filteredSessions"]),
  },
};
</script>
