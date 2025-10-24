<template>
  <v-card flat v-if="loading">
    <div v-for="n in 2" :key="n" class="d-flex pa-4 align-center">
      <v-skeleton-loader class="flex-grow-1" type="heading" />
      <v-skeleton-loader
        class="flex-grow-1"
        :type="n === 1 ? 'text' : 'heading'"
      />
    </div>
    <div class="py-4">
      <div v-for="n in 2" class="px-4" :key="`tbody-${n}`">
        <div class="d-flex">
          <v-skeleton-loader class="flex-grow-1" type="table-cell" />
          <v-skeleton-loader class="flex-grow-1" type="table-cell" />
        </div>
        <v-skeleton-loader type="divider" />
      </div>
    </div>
  </v-card>

  <v-card flat v-else>
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
    loading: Boolean,
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

.v-skeleton-loader >>> .v-skeleton-loader__table-thead {
  max-width: 33% !important;
}
</styles>
