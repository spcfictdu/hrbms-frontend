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
      <DefaultTable
        :headers="headers"
        :items="mappedTransactionDetails"
        itemKey="paymentId"
        :footerProps="footerProps"
        disableSort
        @onQuery="assignParams($event)"
      >
        <template v-slot:[`item.paymentType`]="{ item }">
          <v-chip
            :color="mopColors[item.paymentType]"
            dark
            small
            class="text-overline"
            >{{ item.paymentType.replaceAll("_", " ") }}</v-chip
          >
        </template>

        <template v-slot:[`item.menu`]>
          <v-menu offset-x left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense class="py-0">
              <v-list-item
                class="menu-border"
                v-for="(item, i) in menuItems"
                :key="i"
              >
                <v-list-item-title class="text-body-2 font-weight-regular">{{
                  item.text
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </DefaultTable>
    </div>
  </v-card>
</template>

<script>
import DefaultTable from "../tables/DefaultTable.vue";
import { format, parseISO } from "date-fns";
import { assignParams } from "@/mixins/FormattingFunctions";
import CashierTransactionDetailsTableHeader from "./CashierTransactionDetailsTableHeader.vue";

export default {
  name: "CashierTransactionDetalisTable",
  components: { DefaultTable, CashierTransactionDetailsTableHeader },
  props: { transactionDetails: Object },
  mixins: [assignParams],
  data: () => ({
    headers: [
      {
        text: "Status",
        value: "status",
      },
      {
        text: "Product",
        value: "product",
      },
      {
        text: "Price",
        value: "price",
      },
      {
        text: "Quantity",
        value: "quantity",
      },
      {
        text: "Total Price",
        value: "totalPrice",
      },
      {
        text: "Discount",
        value: "discount",
      },
      {
        text: "Payment Type",
        value: "paymentType",
      },
      {
        text: "Time",
        value: "time",
      },
      {
        text: "",
        value: "menu",
      },
    ],
    mopColors: {
      CASH: "cash",
      CREDIT_CARD: "creditCard",
      GCASH: "gCash",
      CHEQUE: "cheque",
    },
    footerProps: {
      itemsPerPageOptions: [5, 10, 15],
    },
    menuItems: [{ text: "Issue Refund" }, { text: "Void Payment" }],
  }),
  computed: {
    mappedTransactionDetails() {
      console.log(this.transactionDetails);
      if (this.transactionDetails) {
        return this.transactionDetails.data.map((t) => ({
          status: t.status,
          product: t.product,
          price: t.price,
          quantity: t.quantity,
          totalPrice: t.totalPrice,
          discount: t.discount,
          paymentType: t.paymentType,
          time: t.time,
        }));
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

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
