<template>
  <v-card flat>
    <CashierTransactionDetailsTableHeader :headerDetails="headerDetails" />

    <div class="pa-5">
      <DefaultTable
        :headers="headers"
        :items="mappedTransactionDetails"
        itemKey="paymentId"
        :footerProps="footerProps"
        disableSort
        :hideDefaultFooter="true"
      >
        <template v-slot:[`item.status`]="{ item }">
          <span
            :class="getStatusColor(item.status)"
            class="font-weight-medium"
            >{{ item.status }}</span
          >
        </template>

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
import CashierTransactionDetailsTableHeader from "./CashierTransactionDetailsTableHeader.vue";
import { format, parseISO } from "date-fns";

export default {
  name: "CashierTransactionDetalisTable",
  components: { DefaultTable, CashierTransactionDetailsTableHeader },
  props: { transactionDetails: Object, headerDetails: Object },
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
        text: "Payment Method",
        value: "paymentMethod",
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
    menuItems: [{ text: "Refund Payment" }, { text: "Void Transaction" }],
  }),
  created() {},
  methods: {
    getStatusColor(status) {
      const statusColors = {
        PAID: "light-green--text accent-3",
        // PARTIAL: "light-green--text accent-2",
        PENDING: "primary--text",
      };

      return statusColors[status];
    },
  },
  computed: {
    mappedTransactionDetails() {
      console.log(this.transactionDetails);
      if (!this.transactionDetails) return;

      const { transaction, room, priceSummary } = this.transactionDetails;
      return [
        {
          status: transaction.paymentStatus,
          product: room.name,
          price: priceSummary.roomTotal,
          quantity: transaction.extraPerson,
          totalPrice: priceSummary.finalRoomTotal.toFixed(2),
          discount: (
            Number(priceSummary.roomTotal) + priceSummary.finalRoomTotal
          ).toFixed(2),
          paymentMethod: "",
          time: format(parseISO(transaction.createdAt), "H:mm:ss"),
        },
        ...(priceSummary.fullAddons.length
          ? priceSummary.fullAddons.map((addon) => ({
              status: addon.paymentStatus,
              product: addon.name,
              price: addon.unit_price,
              quantity: addon.quantity,
              totalPrice: addon.total,
              discount: "0.00",
              paymentMethod: "",
              time: format(parseISO(addon.createdAt), "H:mm:ss"),
            }))
          : {}),
      ];
    },
  },
  watch: {
    // queryParams: {
    //   immediate: true,
    //   deep: true,
    //   handler: async function (v) {
    //     const data = {
    //       ...v,
    //       ...(v.addons && {
    //         addons: v.addons
    //           .filter(({ name }) => name)
    //           .map(({ name, quantity }) => `${name}-${quantity}`),
    //       }),
    //     };
    //
    //     if (!data.addons) {
    //       this.$delete(data, "addons");
    //     }
    //
    //     // if (!data.discount) this.$delete(data, "discount");
    //     // if (!data.voucherCode) this.$delete(data, "voucherCode");
    //
    //     await this.fetchRoom(data);
    //
    //     // Needed by the Parent Component
    //     // this.$emit("capacity", this.room[0].extraPersonCapacity || [0]);
    //     // this.$emit("totalPayment", this.room[0].roomTotalWithExtraPerson);
    //   },
    // },
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
