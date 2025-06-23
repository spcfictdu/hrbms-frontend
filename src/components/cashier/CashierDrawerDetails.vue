<template>
  <v-expand-transition>
    <div v-show="showDetails">
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col v-for="payment in payments" :key="payment.name" cols="6">
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
    payments: Array,
  },
  data: () => ({
    buttons: [
      {
        text: "View Cashier History",
      },
      {
        text: "View Cashier Drawer",
      },
    ],
  }),
};
</script>
