<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader
      printable
      backButton
      :dividerMarginTop="18"
      @print="handlePrint"
    >
      <template #subtitle>
        <v-skeleton-loader
          class="pt-1 mb-1"
          v-if="loading"
          type="text"
          height="24"
          max-width="300"
        />
        <div
          v-else-if="guestBillingReport"
          class="grey--text text--darken-2 mb-1"
        >
          Guest: {{ guestBillingReport?.guestName }}
        </div>
      </template>
    </PageHeader>

    <div ref="billingReport">
      <div v-if="loading" class="py-4">
        <v-skeleton-loader
          v-for="n in 4"
          :key="n"
          type="text"
          min-height="24"
          max-width="200"
        />
      </div>
      <div v-else-if="guestBillingReport" class="py-4">
        <div v-for="({ text, value }, index) in reportDetails" :key="index">
          <span>{{ text }}: </span>
          <span class="font-weight-bold">{{ value }}</span>
        </div>
      </div>

      <div class="d-flex flex-column" :style="{ gap: '2rem' }">
        <v-skeleton-loader
          type="table"
          :types="{ 'table-tbody': 'table-row-divider@3' }"
          v-if="loading"
        />
        <DefaultTable
          v-else
          :itemsPerPage="-1"
          :headers="headers"
          :items="items"
          hideDefaultFooter
          disableSort
        >
          <template v-slot:[`item.paymentType`]="{ item }">
            <v-chip
              v-if="item.paymentType"
              :color="getPaymentTypeColor(item.paymentType)"
              dark
              small
              class="text-overline"
              >{{ item.paymentType.replaceAll("_", " ") }}</v-chip
            >
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <span
              :style="{
                fontWeight: '500',
                color: getStatusColor(item.status),
              }"
              >{{ item.status }}</span
            >
          </template>
        </DefaultTable>

        <div class="folio-breakdown">
          <div class="text-overline font-weight-bold">
            Folio Charge Breakdown
          </div>
          <v-skeleton-loader
            type="table"
            :types="{ 'table-tbody': 'table-row-divider@3' }"
            v-if="loading"
          />
          <DefaultTable
            v-else
            :itemsPerPage="-1"
            :headers="folioHeaders"
            :items="folioItems"
            hideDefaultFooter
            disableSort
          ></DefaultTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import DefaultTable from "@/components/tables/DefaultTable.vue";
import formatPrice from "@/utils/format-price";
import PrintReport from "@/mixins/PrintReport";
import { mapActions, mapGetters, mapState } from "vuex";
import { format } from "date-fns";

export default {
  name: "BillingReportView",
  components: { PageHeader, DefaultTable },
  props: {
    transactionRefNum: String,
  },
  mixins: [PrintReport],
  data() {
    return {
      headers: [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Item",
          value: "item",
        },
        {
          text: "Gross Amount",
          value: "grossAmount",
        },
        {
          text: "Payment",
          value: "payment",
        },
        {
          text: "Payment Type",
          value: "paymentType",
        },
        {
          text: "Balance",
          value: "balance",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "User",
          value: "user",
        },
      ],
      folioHeaders: [
        {
          text: "Item",
          value: "item",
        },
        {
          text: "Folio A",
          value: "folioA",
        },
        {
          text: "Folio B",
          value: "folioB",
        },
        {
          text: "Folio C",
          value: "folioC",
        },
        {
          text: "Folio D",
          value: "folioD",
        },
      ],
    };
  },
  methods: {
    ...mapActions("reports", ["fetchGuestBillingReport"]),

    handlePrint() {
      const table = this.$refs.billingReport;
      const options = {
        reportTitle: "Guest Billing Report",
        headerText: this.guestBillingReport?.guestName,
      };
      this.printReport(table, options);
    },

    getPaymentTypeColor(paymentType) {
      const paymentTypeColors = {
        CASH: "cash",
        GCASH: "gCash",
        CREDIT_CARD: "creditCard",
        CHEQUE: "cheque",
      };

      return paymentTypeColors[paymentType];
    },

    getStatusColor(status) {
      // const statusColors = {
      //   PAID: "cash--text",
      //   // PARTIAL: "light-green--text accent-2",
      //   PENDING: "primary--text",
      //   REFUNDED: "red--text text--accent-4",
      //   VOIDED: "red--text text--accent-4",
      // };

      const statusColors = {
        PAID: "green",
        // PARTIAL: "light-green--text accent-2",
        PENDING: "#2f45b7",
        REFUNDED: "red",
        VOIDED: "red",
      };

      return statusColors[status];
    },
  },
  computed: {
    ...mapState("reports", ["guestBillingReport"]),
    ...mapGetters("reports", ["getLoading"]),

    loading() {
      return this.getLoading("guestBillingReport");
    },

    reportDetails() {
      if (!this.guestBillingReport) return [];

      const {
        roomNumber,
        roomType,
        totalGuests,
        checkIn,
        checkOut,
        discountedAmount,
      } = this.guestBillingReport;

      const reportDetails = [
        {
          text: "Room No.",
          value: roomNumber,
        },
        {
          text: "Room Type",
          value: roomType,
        },
        {
          text: "Total Guests",
          value: totalGuests,
        },
        {
          text: "Discount",
          value: formatPrice(discountedAmount),
        },
      ];

      if (checkIn) {
        reportDetails.push({
          text: "Arrival",
          value: format(checkIn, "MM/dd/yyyy hh:mm:ss a"),
        });
      }

      if (checkOut) {
        reportDetails.push({
          text: "Departure",
          value: format(checkOut, "MM/dd/yyyy hh:mm:ss a"),
        });
      }

      return reportDetails;
    },

    items() {
      if (!this.guestBillingReport?.transactions) return [];
      const items = [];
      this.guestBillingReport.transactions.forEach((trans) => {
        const date = format(new Date(trans.datetime), "MM/dd/yy");
        const item =
          trans.item === "PAYMENT"
            ? "Payment"
            : `${trans.item}${
                trans.quantity > 1 ? ` (x${trans.quantity})` : ""
              }`;
        const grossAmount = formatPrice(trans.price);
        const payment = formatPrice(trans.paymentAmount);
        const paymentType = trans.paymentType;
        const balance = formatPrice(parseFloat(trans.balance));
        const status = trans.paymentStatus ?? "";
        const user = trans.user;
        items.push({
          date,
          item,
          grossAmount,
          payment,
          paymentType,
          balance,
          status,
          user,
        });
      });

      items.push({
        date: "",
        item: "Please pay this amount: ",
        refNum: "",
        payment: "",
        paymentType: "",
        balance: formatPrice(
          this.guestBillingReport.transactions.at(-1).balance
        ),
        status: "",
        user: "",
      });

      return items;
    },

    folioItems() {
      if (!this.guestBillingReport?.transactions) return [];
      const folioSums = { folioA: 0, folioB: 0, folioC: 0, folioD: 0 };
      const folios = [];
      this.guestBillingReport.transactions.forEach((trans) => {
        if (trans.folio) {
          const item = `${trans.item}${
            trans.quantity > 1 ? ` (x${trans.quantity})` : ""
          }`;
          // Always sum charges if folio exists
          ["folioA", "folioB", "folioC", "folioD"].forEach((key) => {
            const folio = trans.folio[key];
            if (folio) {
              folioSums[key] += Number(folio.charge) || 0;
            }
          });
          // Now for display
          const row = {
            item,
            folioA: "",
            folioB: "",
            folioC: "",
            folioD: "",
          };
          let hasCharge = false;
          ["folioA", "folioB", "folioC", "folioD"].forEach((key) => {
            const folio = trans.folio[key];
            if (folio) {
              const shouldDisplay = folio.charge > 0 || key === "folioA";
              if (shouldDisplay) {
                const label =
                  folio.name || `Folio ${key.slice(-1).toUpperCase()}`;
                row[key] = `${label}: ${formatPrice(folio.charge)}`;
                hasCharge = true;
              }
            }
          });
          if (hasCharge) {
            folios.push(row);
          }
        }
      });
      const totalRow = {
        item: "Total",
        folioA: formatPrice(folioSums.folioA),
        folioB: formatPrice(folioSums.folioB),
        folioC: formatPrice(folioSums.folioC),
        folioD: formatPrice(folioSums.folioD),
      };
      folios.push(totalRow);
      return folios;
    },
  },
  created() {
    if (!this.transactionRefNum) return;
    this.fetchGuestBillingReport(this.transactionRefNum);
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}

::v-deep tbody tr:last-child td {
  font-weight: bold !important;
}

.folio-breakdown {
  page-break-inside: avoid;
}
</style>
