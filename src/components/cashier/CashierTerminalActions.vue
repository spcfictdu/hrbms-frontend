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
        :color="action.plain ? '' : 'lightBg'"
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
        :color="action.plain ? '' : 'lightBg'"
        class="font-weight-bold px-6 ml-3"
        @click="action.action"
      >
        {{ action.name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CashierTerminalActions",
  data: () => ({}),
  methods: {
    ...mapActions("cashier", ["fetchSessions"]),
  },
  computed: {
    terminalActions() {
      return [
        {
          name: "Open",
          action: () => this.fetchSessions({ status: "ACTIVE" }),
        },
        {
          name: "Close",
          action: () => this.fetchSessions({ status: "INACTIVE" }),
        },
        {
          name: "Reset",
          plain: true,
          action: () => this.fetchSessions(),
        },
      ];
    },
  },
};
</script>
