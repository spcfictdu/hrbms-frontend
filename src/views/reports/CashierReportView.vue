<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader
      backButton
      :headerText="`Cashier ${cashierId}`"
      :dividerMarginTop="36"
      printable
      @print="handlePrint"
    >
      <template #subtitle>
        <div class="grey--text text--darken-2 mb-1">{{ subtitleDate }}</div>
      </template>
    </PageHeader>

    <CashierReportTable
      ref="reportTable"
      :headers="headers"
      :items="items"
      :tableHead="tableHead"
      v-if="cashierReport?.cashierId"
    >
      <template v-slot:[`item.modeOfPayment`]="{ item }">
        <v-chip
          dark
          small
          :color="getPaymentMethodColor(item.modeOfPayment)"
          class="font-weight-medium"
        >
          {{ item.modeOfPayment.replaceAll("_", " ") }}
        </v-chip>
      </template>

      <template v-slot:[`item.type`]="{ item }">
        <v-chip
          dark
          small
          :color="getTransactionTypeColor(item.type)"
          class="font-weight-medium"
        >
          {{ item.type }}
        </v-chip>
      </template>
    </CashierReportTable>
    <v-card flat v-else>
      <v-skeleton-loader type="table-heading" height="82" class="px-2" />
      <v-skeleton-loader type="table-thead" class="px-5" height="48" />
      <v-skeleton-loader type="table-tbody" class="px-1 pb-5 mt-n2" />
    </v-card>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import CashierReportTable from "./CashierReportTable.vue";

import formatPrice from "@/utils/format-price";
import { parseISO, format } from "date-fns";
import { mapActions, mapGetters } from "vuex";
import PrintReport from "@/mixins/PrintReport";

export default {
  name: "CashierReportView",
  props: { cashierId: String, date: String },
  components: { PageHeader, CashierReportTable },
  mixins: [PrintReport],
  data() {
    return {
      headers: [
        { text: "Date", value: "date" },
        { text: "Reference #", value: "referenceNumber" },
        {
          text: "Username",
          value: "username",
        },
        { text: "MOP", value: "modeOfPayment" },
        { text: "Amount", value: "amount" },
        { text: "Type", value: "type" },
      ],
    };
  },
  computed: {
    ...mapGetters("reports", ["getCashierReport"]),
    ...mapGetters("authentication", ["getCurrentUser"]),

    subtitleDate() {
      return format(parseISO(this.date), "EEEE, MMMM dd, yyyy");
    },

    cashierReport() {
      return this.getCashierReport(this.cashierId);
    },

    sortedCashierReport() {
      if (!this.cashierReport) return [];
      return this.cashierReport.transactions.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    },

    items() {
      const date = format(parseISO(this.date), "MMMM d, yyyy");
      // const username = `${this.cashierReport?.user}${
      //   this.isAdmin(this.cashierReport.userId) ? " (ADMIN)" : ""
      // }`;
      return this.sortedCashierReport.map(
        ({
          transactionReferenceNumber: referenceNumber,
          username,
          method,
          amount,
          type,
        }) => {
          const modeOfPayment = method ?? "N/A";
          const statusMap = {
            VOID: "VOIDED",
            REFUND: "REFUNDED",
          };
          return {
            date,
            referenceNumber,
            username,
            modeOfPayment,
            amount: formatPrice(amount),
            type: statusMap[type] ?? type,
          };
        }
      );
    },

    totalCollected() {
      const payments = this.cashierReport?.transactions.filter(
        (t) => t.type === "PAYMENT"
      );
      const totalPayment = payments?.reduce(
        (total, p) => total + Number(p.amount),
        0
      );
      const totalCollected = formatPrice(totalPayment);
      return totalCollected;
    },

    tableHead() {
      return {
        Name: this.cashierReport?.user,
        "Opening Balance": formatPrice(this.cashierReport?.openingBalance),
        "Opening Adjustment": formatPrice(
          this.cashierReport?.openingAdjustment
        ),
        "Total Collected": this.totalCollected,
        Refunded: formatPrice(this.cashierReport?.totalRefunded),
        Voided: formatPrice(this.cashierReport?.totalVoided),
        "Closing Adjustment": formatPrice(
          this.cashierReport?.closingAdjustment
        ),
        "Closing Balance": formatPrice(this.cashierReport?.closingBalance),
      };
    },
  },
  methods: {
    ...mapActions("reports", ["fetchCashierReports"]),

    isAdmin(userId) {
      return userId === 66;
    },

    handlePrint() {
      const options = {
        reportTitle: `Cashier ${this.cashierId} Report`,
        // headerText: this.subtitleDate,
        user: this.getCurrentUser,
        queryDate: this.date,
      };
      this.printReport(this.$refs.reportTable.$el, options);
    },

    getTransactionTypeColor(status) {
      const statusColors = {
        PAYMENT: "cash",
        REFUNDED: "warning",
        VOIDED: "primary",
      };

      return statusColors[status] || "";
    },

    getPaymentMethodColor(paymentMethod) {
      const paymentMethodColors = {
        CASH: "cash",
        CHEQUE: "cheque",
        GCASH: "gCash",
        CREDIT_CARD: "creditCard",
      };

      return paymentMethodColors[paymentMethod] || "";
    },
  },
  created() {
    this.fetchCashierReports({ date: this.date });
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
