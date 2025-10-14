<template>
  <v-card flat>
    <CashierTransactionPaymentsTableHeader :headerDetails="tableHead" />

    <div class="px-5 pb-5">
      <DefaultTable
        :headers="headers"
        :items="mappedItems"
        :height="mappedItems.length > 4 ? '264px' : undefined"
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
  props: {
    tableHead: Array,
    mappedItems: Array,
  },
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
};
</script>

<styles scoped>
  .v-data-table__wrapper {
    max-height: 264px;
  }
</styles>
