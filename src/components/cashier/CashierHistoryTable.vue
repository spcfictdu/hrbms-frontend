<template>
  <v-card flat>
    <CashierHistoryTableHeader
      :numberOfItems="mappedHistory.length"
      :loaded="!!mappedHistory.length"
    />

    <div class="pa-5">
      <PaginatedTable
        :headers="tableHeaders"
        :items="mappedHistory"
        itemKey="paymentId"
        groupBy="date"
        :footerProps="footerProps"
        :serverItemsLength="history.meta?.total"
        disableSort
        @onQuery="assignParams($event)"
        @click:row="handleSelectRow"
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
          <td :colspan="tableHeaders.length" class="pl-8">
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
import CashierHistoryTableHeader from "./CashierHistoryTableHeader.vue";

export default {
  name: "CashierHistoryTable",
  components: { PaginatedTable, CashierHistoryTableHeader },
  props: { history: [Object, Array], tableHeaders: Array, fetchingTab: Object },
  mixins: [assignParams],
  data: () => ({
    mopColors: {
      CASH: "cash",
      CREDIT_CARD: "creditCard",
      GCASH: "gCash",
      CHEQUE: "cheque",
    },
  }),
  methods: {
    handleSelectRow(row) {
      if (this.history?.data)
        this.$router.push({
          name: "Cashier Transaction Details",
          params: { ...this.$route.params, paymentId: String(row.paymentId) },
        });
    },
  },
  computed: {
    mappedHistory() {
      console.log(this.history);
      if (this.history?.data) {
        const transactions = [];
        for (const session of this.history.data) {
          transactions.push(
            ...session.payments.map((item) => ({
              employee: `${session.firstName} - S${session.userId}`,
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
      } else {
        return (
          this.history.map((item) => ({
            employee: `${item.userFullName.split(" ")[0]} - S${item.userId}`,
            openingAdjustment: item.openingBalance ?? "0.00",
            beginningBalance: item.beginningBalance ?? "0.00",
            openingBalance: item.openingBalance ?? "0.00",
            closingBalance: item.closingBalance ?? "0.00",
            refund: "0.00",
            voided: "0.00",
            time: format(parseISO(item.openedAt), "H:mm:ss"),
            date: format(parseISO(item.openedAt), "MMMM dd, yyyy"),
          })) || []
        );
      }
    },

    footerProps() {
      return {
        itemsPerPageOptions: this.history?.data ? [2, 2] : [5, 10, 15],
        itemsPerPageText: "Sessions per page:",
      };
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (v) {
        if (this.fetchingTab.title === "Adjustment") return;
        this.$emit("query", v);
      },
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
