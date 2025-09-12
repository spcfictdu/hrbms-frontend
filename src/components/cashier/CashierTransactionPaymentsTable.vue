<template>
  <v-card flat>
    <CashierTransactionPaymentsTableHeader :headerDetails="headerDetails" />

    <div class="px-5 pb-5">
      <DefaultTable
        :headers="headers"
        :items="mappedPayments"
        :height="mappedPayments.length > 4 ? '264px' : undefined"
        fixedHeader
        hideDefaultFooter
      >
        <template v-slot:[`item.paymentMethod`]="{ item }">
          <span
            :class="getPaymentMethodColor(item.paymentMethod) + '--text'"
            class="font-weight-medium"
            >{{ item.paymentMethod.replaceAll("_", " ") }}</span
          >
        </template>
      </DefaultTable>
    </div>
  </v-card>
</template>

<script>
import DefaultTable from "../tables/DefaultTable.vue";
import CashierTransactionPaymentsTableHeader from "./CashierTransactionPaymentsTableHeader.vue";

export default {
  name: "CashierTransactionPaymentsTable",
  components: { CashierTransactionPaymentsTableHeader, DefaultTable },
  props: { payments: Array, transactionDetails: Object },
  data: () => ({
    headers: [
      {
        text: "Amount",
        value: "amount",
      },
      {
        text: "Payment Method",
        value: "paymentMethod",
      },
    ],
  }),
  methods: {
    getPaymentMethodColor(paymentMethod) {
      const statusColors = {
        CASH: "cash",
        GCASH: "gCash",
        CREDIT_CARD: "creditCard",
        CHEQUE: "cheque",
      };

      return statusColors[paymentMethod];
    },
  },
  computed: {
    headerDetails() {
      const totalPayment = this.transactionDetails?.paymentSummary.reduce(
        (total, prev) => total + Number(prev.amountReceived),
        0
      );

      const totalPurchase =
        this.transactionDetails?.priceSummary.finalRoomTotal +
        this.transactionDetails?.priceSummary.fullAddons.reduce(
          (total, addon) => total + addon.total,
          0
        );

      const totalBalance = totalPayment - totalPurchase;

      return [
        {
          headerText: "Total Payment",
          value: {
            text: `+${totalPayment.toFixed(2)}`,
            styles: "cash--text",
          },
        },
        {
          headerText: "Total Balance",
          value: {
            text:
              totalBalance > 0
                ? `+${totalBalance.toFixed(2)}`
                : totalBalance.toFixed(2),
            styles: totalBalance >= 0 ? "cash--text" : "red--text",
          },
        },
      ];
    },

    mappedPayments() {
      const withAmount = this.transactionDetails?.paymentSummary.filter(
        (p) => p.amountReceived !== "0.00"
      );

      return withAmount.map((p) => ({
        amount: `+${p.amountReceived}`,
        paymentMethod: p.paymentType,
      }));
    },
  },
};
</script>

<styles scoped>
  .v-data-table__wrapper {
    max-height: 264px;
  }
</styles>
