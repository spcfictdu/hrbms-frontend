<template>
  <v-card flat>
    <CashierHistoryTableHeader
      :numberOfItems="mappedHistory.length"
      :loaded="!!mappedHistory.length"
    />

    <div class="pa-5">
      <PaginatedTable
        :headers="headers"
        :items="mappedHistory"
        itemKey="paymentId"
        groupBy="date"
        :footerProps="footerProps"
        :serverItemsLength="history.meta.total"
      >
        <template v-slot:[`item.MOP`]="{ item }">
          <v-chip
            :color="mopColors[item.MOP]"
            dark
            small
            class="text-overline"
            >{{ item.MOP.replaceAll("_", " ") }}</v-chip
          >
        </template>
        <template v-slot:[`group.header`]="{ group }">
          <td :colspan="headers.length" class="pl-8">
            {{ group }}
          </td>
        </template>
      </PaginatedTable>
    </div>
  </v-card>
</template>

<script>
import PaginatedTable from "../tables/PaginatedTable.vue";
import { format, parseISO } from "date-fns";
import CashierHistoryTableHeader from "./CashierHistoryTableHeader.vue";

export default {
  name: "CashierHistoryTable",
  components: { PaginatedTable, CashierHistoryTableHeader },
  props: { history: Object },
  data: () => ({
    headers: [
      {
        text: "Employee ID",
        value: "employeeId",
        width: "180px",
      },
      {
        text: "MOP",
        value: "MOP",
      },
      {
        text: "Guest Name",
        value: "guestName",
      },
      {
        text: "Total Payment",
        value: "totalPayment",
      },
      {
        text: "Discount",
        value: "discount",
      },
      {
        text: "Refund",
        value: "refund",
      },
      {
        text: "Voided",
        value: "voided",
      },
      {
        text: "Time",
        value: "time",
      },
    ],
    mopColors: {
      CASH: "cash",
      CREDIT_CARD: "creditCard",
      GCASH: "gCash",
      CHEQUE: "cheque",
    },
    footerProps: {
      itemsPerPageOptions: [],
      itemsPerPageText: "",
    },
  }),
  computed: {
    mappedHistory() {
      if (this.history) {
        const transactions = [];
        for (const session of this.history.data) {
          transactions.push(
            ...session.payments.map((item) => ({
              employeeId: "S" + this.$route.params.id,
              MOP: item.paymentType,
              totalPayment: item.amountReceived,
              guestName: item.guestName,
              discount: item.discount,
              refund: "0.00",
              voided: "0.00",
              time: format(parseISO(item.createdAt), "H:mm:ss"),
              date: format(parseISO(session.openedAt), "MMMM dd, yyyy"),
              paymentId: item.paymentId,
            }))
          );
        }
        return transactions;
      }
      return [];
    },
  },
};
</script>

<style>
.v-data-footer {
  justify-content: end;
  min-height: 59px;
}
</style>
