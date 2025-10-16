<template>
  <Reports
    :headers="headers"
    :items="mappedCashierReports"
    @dateselect="handleDateSelect"
    @click:row="redirect"
    :loading="isCashierLoading"
  >
    <template #icon>
      <div>
        <v-autocomplete
          :items="mappedCashiers"
          placeholder="CASHIER"
          item-text="name"
          item-value="id"
          v-model="cashierSessionId"
          dense
          filled
          rounded
          auto-select-first
          clearable
        />
      </div>
    </template>

    <template>
      <div v-if="cashierSessionId">
        <div class="font-weight-bold text-h6">{{ cashierName }}</div>
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

export default {
  name: "CashierReportsView",
  components: { Reports },
  data() {
    return {
      cashierSessionId: null,
      headers: [
        { text: "Date", value: "date", align: "center" },
        { text: "Session Code", value: "sessionCode", align: "center" },
        {
          text: "Beggining Balance",
          value: "begginingBalance",
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

    cashierName() {
      return this.cashierReports.find(
        ({ cashierSessionId }) => cashierSessionId === this.cashierSessionId
      )?.user;
    },

    mappedCashiers() {
      if (!this.cashierReports.length) return [];

      return this.cashierReports.map(({ cashierSessionId }) => ({
        name: `CASHIER ${cashierSessionId}`,
        id: cashierSessionId,
      }));
    },

    mappedCashierReports() {
      if (!this.cashierReports.length) return [];

      let cashierReports = this.cashierReports;
      if (this.cashierSessionId) {
        cashierReports = cashierReports.filter(
          ({ cashierSessionId }) => cashierSessionId === this.cashierSessionId
        );
      }

      return cashierReports.map(
        ({
          cashierSessionId,
          openingBalance,
          transactions,
          totalRefunded,
          closingBalance,
        }) => {
          const date = format(parseISO(this.queryDate), "EEEE, MMMM dd yyyy");
          const sessionCode = `Session ${cashierSessionId}`;
          const begginingBalance = formatPrice(openingBalance);
          const payments = transactions.filter((t) => t.type === "PAYMENT");
          const totalPayment = payments.reduce(
            (total, p) => total + Number(p.amount),
            0
          );
          const totalCollected = formatPrice(totalPayment);
          const refunds = formatPrice(totalRefunded);

          return {
            date,
            sessionCode,
            begginingBalance,
            totalCollected,
            refunds,
            closingBalance: formatPrice(closingBalance),
            cashierSessionId,
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

    redirect(row) {
      const cashierSessionId = String(row.cashierSessionId);
      this.$router.push({
        name: "CashierReport",
        params: { cashierSessionId, date: this.queryDate },
      });
    },

    handleDateSelect(date) {
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
