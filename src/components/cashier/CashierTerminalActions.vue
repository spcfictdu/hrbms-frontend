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
      >
        {{ action.name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "CashierTerminalActions",
  data: () => ({
    terminalActions: [
      {
        name: "Open",
      },
      {
        name: "Close",
      },
      {
        name: "Reset",
        plain: true,
      },
    ],
  }),
};
</script>
