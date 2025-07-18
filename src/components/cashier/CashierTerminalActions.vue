<template>
  <div>
    <div class="d-none d-sm-block">
      <v-btn
        v-for="action in terminalActions"
        :key="action.name"
        rounded
        depressed
        small
        :plain="action.plain"
        :color="selectedButtonColor(action)"
        class="font-weight-bold px-8 ml-3"
        @click="action.action"
      >
        {{ action.name }}
      </v-btn>
    </div>

    <div class="d-sm-none">
      <v-btn
        v-for="action in terminalActions"
        :key="action.name"
        rounded
        depressed
        x-small
        :plain="action.plain"
        :color="selectedButtonColor(action)"
        class="font-weight-bold px-6 ml-3"
        @click="action.action"
      >
        {{ action.name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "CashierTerminalActions",
  data: () => ({
    selectedCashiers: null,
  }),
  methods: {
    ...mapMutations("cashier", ["SET_FILTERED_SESSIONS"]),

    selectedButtonColor(button) {
      if (button.plain) return;

      return this.selectedCashiers === button.name ? "primary" : "lightBg";
    },
  },
  computed: {
    terminalActions() {
      return [
        {
          name: "Open",
          action: () => {
            this.SET_FILTERED_SESSIONS("ACTIVE");
            this.selectedCashiers = "Open";
          },
        },
        {
          name: "Close",
          action: () => {
            this.SET_FILTERED_SESSIONS("INACTIVE");
            this.selectedCashiers = "Close";
          },
        },
        {
          name: "Reset",
          plain: true,
          action: () => {
            this.SET_FILTERED_SESSIONS();
            this.selectedCashiers = null;
          },
        },
      ];
    },
  },
};
</script>
