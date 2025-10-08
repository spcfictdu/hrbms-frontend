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
          @click.stop="button.action"
        >
          {{ button.text }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-expand-transition>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "CashierDrawerDetails",
  props: {
    showDetails: Boolean,
    sessionData: Object,
    drawerNumber: Number,
  },
  data: () => ({}),
  methods: {
    ...mapMutations("cashier", ["SET_DIALOG", "SET_CURRENT_CASHIER"]),

    showConfirmationDialog() {
      this.SET_DIALOG({ key: "confirmation", value: true });
      this.SET_CURRENT_CASHIER({
        session: this.sessionData,
        drawerNumber: this.drawerNumber,
      });
    },
  },
  computed: {
    buttons() {
      return [
        {
          text: "View Cashier History",
          action: () =>
            this.$router.push({
              name: "Cashier History",
              params: {
                id: String(this.sessionData.userId),
                drawerNumber: String(this.drawerNumber),
              },
            }),
        },
        {
          text: "View Cashier Drawer",
          action: () => {
            if (this.sessionData.status === "INACTIVE") {
              this.showConfirmationDialog();
              return;
            }

            this.$router.push({
              name: "Cashier",
              params: {
                id: String(this.sessionData.userId),
              },
            });
          },
        },
      ];
    },

    drawerDetails() {
      const drawerDetails = [
        ...(this.sessionData.payments?.length
          ? this.sessionData.payments
          : [
              {
                name: "CASH",
                totalAmount: "0.00",
              },
              {
                name: "GCASH",
                totalAmount: "0.00",
              },
              {
                name: "CHEQUE",
                totalAmount: "0.00",
              },
              {
                name: "CREDIT CARD",
                totalAmount: "0.00",
              },
            ]),
        {
          name: "Refund",
          totalAmount: this.sessionData.refunded ?? "0.00",
        },
        {
          name: "Voided",
          totalAmount: this.sessionData.voided ?? "0.00",
        },
        {
          name: "Opening Balance",
          totalAmount: this.sessionData.openingBalance ?? "0.00",
        },
        {
          name: "Closing Balance",
          totalAmount: this.sessionData.closingBalance ?? "0.00",
        },
        {
          name: "Opening Adjustment",
          totalAmount: this.sessionData.openingAdjustment ?? "0.00",
        },
        {
          name: "Closing Adjustment",
          totalAmount: this.sessionData.closingAdjustment ?? "0.00",
        },
        {
          name: "Beginning Balance",
          totalAmount: this.sessionData.beginningBalance ?? "0.00",
        },
      ];

      return drawerDetails;
    },
  },
};
</script>
