<template>
  <Reports
    :headers="headers"
    :items="mappedCashierReports"
    @dateselect="handleDateSelect"
    @click:row="redirect"
    :loading="isCashierLoading"
    @print="handlePrint"
  >
    <template #icon>
      <div>
        <v-autocomplete
          :items="mappedCashiers"
          placeholder="CASHIER"
          item-text="name"
          item-value="id"
          v-model="cashierId"
          dense
          filled
          rounded
          auto-select-first
          clearable
        />
      </div>
    </template>

    <template>
      <div v-if="cashierId">
        <div class="font-weight-bold text-h6">
          {{ cashier?.user }}{{ adminLabel(cashier?.userId) }}
        </div>
        <div class="longText--text">
          <span class="font-weight-bold">DATE:</span> {{ formattedQueryDate }}
        </div>
      </div>
    </template>
  </Reports>
</template>

<script>
import Reports from "@/components/reports/Reports.vue";
import formatPrice from "@/utils/format-price";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { format, parseISO } from "date-fns";
import PrintReport from "@/mixins/PrintReport";

export default {
  name: "CashierReportsView",
  components: { Reports },
  mixins: [PrintReport],
  data() {
    return {
      cashierId: null,
      headers: [
        { text: "Date", value: "date", align: "center" },
        { text: "Cashier", value: "cashier", align: "center" },
        {
          text: "Opening Balance",
          value: "openingBalance",
          align: "center",
        },
        { text: "Total Collected", value: "totalCollected", align: "center" },
        { text: "Refunds", value: "refunds", align: "center" },
        { text: "Closing Balance", value: "closingBalance", align: "center" },
      ],
    };
  },
  computed: {
    ...mapState("reports", ["cashierReports"]),
    ...mapGetters("reports", ["isCashierLoading"]),
    ...mapGetters("authentication", ["getCurrentUser"]),

    cashier() {
      return this.cashierReports.find(
        ({ cashierId }) => cashierId === this.cashierId
      );
    },

    mappedCashiers() {
      if (!this.cashierReports.length) return [];

      return this.cashierReports.map(({ cashierId }) => ({
        name: `CASHIER ${cashierId.toString().toUpperCase()}`,
        id: cashierId,
      }));
    },

    mappedCashierReports() {
      if (!this.cashierReports.length) return [];

      let cashierReports = this.cashierReports;
      if (this.cashierId) {
        cashierReports = cashierReports.filter(
          ({ cashierId }) => cashierId === this.cashierId
        );
      }

      return cashierReports.map(
        ({
          user,
          cashierId,
          openingBalance,
          transactions,
          totalRefunded,
          closingBalance,
        }) => {
          const date = format(parseISO(this.queryDate), "EEEE, MMMM dd, yyyy");
          const parts = user.split(",");
          const lastName = parts[0].trim();
          const firstName = parts[1].trim().toUpperCase();
          const cashier = `Cashier ${cashierId
            .toString()
            .toUpperCase()} - ${firstName} ${lastName}`;
          const payments = transactions.filter((t) => t.type === "PAYMENT");
          const totalPayment = payments.reduce(
            (total, p) => total + Number(p.amount),
            0
          );
          const totalCollected = formatPrice(totalPayment);
          const refunds = formatPrice(totalRefunded);

          return {
            date,
            cashier,
            openingBalance: formatPrice(openingBalance),
            totalCollected,
            refunds,
            closingBalance: formatPrice(closingBalance),
            cashierId,
          };
        }
      );
    },

    queryDate() {
      return this.$route.query.date || format(new Date(), "yyyy-MM-dd");
    },

    formattedQueryDate() {
      return format(parseISO(this.queryDate), "MMMM dd, yyyy");
    },
  },
  methods: {
    ...mapActions("reports", ["fetchCashierReports"]),
    ...mapMutations("reports", ["SET_CASHIER_REPORTS"]),

    adminLabel(userId) {
      return this.isAdmin(userId) ? " (ADMIN)" : "";
    },

    isAdmin(userId) {
      return userId >= 1 && userId <= 4;
    },

    handlePrint(table) {
      const options = {
        reportTitle: "Cashiers Report",
        headerText: this.cashier
          ? `Cashier ${this.cashierId}: ${this.cashier?.user}${this.adminLabel(
              this.cashier?.userId
            )}`
          : "All Cashiers",
        user: this.getCurrentUser,
        queryDate: this.queryDate,
      };
      this.printReport(table, options);
    },

    redirect(row) {
      const cashierId = String(row.cashierId).toLowerCase();
      this.$router.push({
        name: "CashierReport",
        params: { cashierId, date: this.queryDate },
      });
    },

    handleDateSelect(date) {
      this.cashierId = null;
      this.fetch(date);
      this.setRouteQuery(date);
    },

    fetch(date) {
      this.fetchCashierReports({ date });
    },

    async setRouteQuery(date) {
      const newQuery = { ...this.$route.query, date };
      try {
        await this.$router.replace({ query: newQuery });
      } catch (err) {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      }
    },
  },
  created() {
    this.fetch(this.queryDate);
  },
  beforeRouteLeave(_to, _from, next) {
    this.SET_CASHIER_REPORTS([]);
    next();
  },
};
</script>
