<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader printable backButton :dividerMarginTop="18">
      <template #subtitle>
        <div v-if="guestBillingReport" class="grey--text text--darken-2 mb-1">
          Guest: {{ guestBillingReport?.guestName }}
        </div>
      </template>
    </PageHeader>

    <DefaultTable
      :itemsPerPage="-1"
      :headers="headers"
      :items="items"
      hideDefaultFooter
      disableSort
    >
      <template v-slot:[`item.source`]="{ item }">
        <div v-if="Array.isArray(item.source)">
          <div v-for="(source, index) in item.source" :key="index">
            {{ source }}
          </div>
        </div>
        <div v-else>{{ item.source }}</div>
      </template>
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
        <span :class="getStatusColor(item.status)" class="font-weight-medium">{{
          item.status
        }}</span>
      </template>
    </DefaultTable>
  </div>
</template>

<script>
import PageHeader from "@/components/headers/PageHeader.vue";
import DefaultTable from "@/components/tables/DefaultTable.vue";
import formatPrice from "@/utils/format-price";
import { mapActions, mapState } from "vuex";
import { format } from "date-fns";

export default {
  name: "BillingReportView",
  components: { PageHeader, DefaultTable },
  props: {
    transactionRefNum: String,
  },
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
          text: "Ref No.",
          value: "refNum",
        },
        {
          text: "Source",
          value: "source",
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
    };
  },
  methods: {
    ...mapActions("reports", ["fetchGuestBillingReport"]),
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
      const statusColors = {
        PAID: "cash--text",
        // PARTIAL: "light-green--text accent-2",
        PENDING: "primary--text",
        REFUNDED: "red--text text--accent-4",
        VOIDED: "red--text text--accent-4",
      };

      return statusColors[status];
    },
  },
  computed: {
    ...mapState("reports", ["guestBillingReport"]),
    items() {
      if (!this.guestBillingReport?.transactions) return [];
      const items = this.guestBillingReport.transactions.map((trans) => {
        const date = format(new Date(trans.datetime), "MM/dd/yy");
        const item =
          trans.item === "PAYMENT"
            ? "Payment"
            : `${trans.item}${
                trans.quantity > 1 ? ` (x${trans.quantity})` : ""
              }`;
        const refNum = trans.paymentId;
        let source = "N/A";
        let paymentAmount = 0;
        if (trans.folio) {
          const folios = [];
          const charges = [
            trans.folio.folioA,
            trans.folio.folioB,
            trans.folio.folioC,
            trans.folio.folioD,
          ];
          charges.forEach((folio, index) => {
            if ((folio.name && folio.charge > 0) || index === 0) {
              const folioLabel = `Folio ${String.fromCharCode(65 + index)}`;
              folios.push(
                `${folioLabel} (${folio.name}): ${formatPrice(folio.charge)}`
              );
            }
          });
          source = folios.length > 0 ? folios : trans.folio.folioType;
          paymentAmount = charges.reduce(
            (sum, folio) => sum + (folio.charge || 0),
            0
          );
        } else if (trans.item === "PAYMENT") {
          source = "Payment";
          paymentAmount = -parseFloat(trans.paymentAmount) || 0;
        }
        const paymentType = trans.paymentType;
        const balance = formatPrice(parseFloat(trans.balance));
        const status = trans.paymentStatus || "";
        const user = trans.user;
        return {
          date,
          item,
          refNum,
          source,
          payment: formatPrice(paymentAmount),
          paymentType,
          balance,
          status,
          user,
        };
      });

      items.push({
        date: "",
        item: "**** nothing follows ****",
        refNum: "",
        source: "Please pay this amount: ",
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
</style>
