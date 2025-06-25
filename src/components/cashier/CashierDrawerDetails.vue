<template>
  <v-expand-transition>
    <div v-show="showDetails">
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              v-for="payment in drawerDetails"
              :key="payment.name"
              cols="6"
            >
              <div>{{ payment.name.replaceAll("_", " ") }}</div>
              <div class="font-weight-bold">PHP {{ payment.totalAmount }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="flex-column pa-6 pt-0">
        <v-btn
          block
          color="primary"
          :outlined="i < 1"
          v-for="(button, i) in buttons"
          :key="button.text"
          class="mt-2 ms-0"
          @click="() => $router.push(button.route)"
        >
          {{ button.text }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-expand-transition>
</template>

<script>
export default {
  name: "CashierDrawerDetails",
  props: {
    showDetails: Boolean,
    sessionData: Object,
    drawerNumber: Number,
  },
  data: () => ({}),
  computed: {
    buttons() {
      return [
        {
          text: "View Cashier History",
          route: {
            name: "Cashier History",
            params: {
              id: String(this.sessionData.userId),
              drawerNumber: String(this.drawerNumber),
            },
          },
        },
        {
          text: "View Cashier Drawer",
          route: {
            name: "Cashier",
            params: {
              id: String(this.sessionData.userId),
            },
          },
        },
      ];
    },
    drawerDetails() {
      const drawerDetails = [
        {
          name: "Opening Balance",
          totalAmount: this.sessionData.openingBalance ?? "0.00",
        },
        {
          name: "Closing Balance",
          totalAmount: this.sessionData.closingBalance ?? "0.00",
        },
        ...this.sessionData.payments,
      ];
      return drawerDetails;
    },
  },
};
</script>
