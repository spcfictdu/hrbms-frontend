<template>
  <v-card flat>
    <CashierTransactionDetailsTableHeader
      :headerDetails="{
        guestName: 'Dalsie Jane Salunga',
        referenceNumber: '00112344532',
        totalPayment: '3,300.00',
        date: 'May 10, 2024',
      }"
    />

    <div class="pa-5">
      <PaginatedTable
        :headers="headers"
        :items="mappedTransactionDetails"
        itemKey="paymentId"
        groupBy="date"
        :footerProps="footerProps"
        :serverItemsLength="transactionDetails?.meta.total"
        disableSort
        @onQuery="assignParams($event)"
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
import { assignParams } from "@/mixins/FormattingFunctions";
import CashierTransactionDetailsTableHeader from "./CashierTransactionDetailsTableHeader.vue";

export default {
  name: "CashierTransactionDetalisTable",
  components: { PaginatedTable, CashierTransactionDetailsTableHeader },
  props: { transactionDetails: Object },
  mixins: [assignParams],
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
      itemsPerPageOptions: [2, 2],
      itemsPerPageText: "Sessions per page:",
    },
  }),
  computed: {
    mappedTransactionDetails() {
      console.log(this.transactionDetails);
      if (this.transactionDetails) {
        const transactions = [];
        for (const session of this.transactionDetails.data) {
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
  watch: {
    queryParams: {
      deep: true,
      handler: function (v) {
        this.$emit("onQuery", v);
      },
    },
  },
};
</script>
