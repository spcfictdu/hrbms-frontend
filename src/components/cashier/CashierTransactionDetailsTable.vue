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

        <template v-slot:[`item.product`]="{ item }">
          <span
            :class="
              isRefundedOrVoided(item.status) && 'text-decoration-line-through'
            "
            >{{ item.product }}</span
          >
        </template>

        <template v-slot:[`item.quantity`]="{ item }">
          <span
            :class="
              isRefundedOrVoided(item.status) && 'text-decoration-line-through'
            "
            >{{ item.quantity }}</span
          >
        </template>

        <template v-slot:[`item.totalPrice`]="{ item }">
          <span
            :class="
              isRefundedOrVoided(item.status) && 'text-decoration-line-through'
            "
            >{{ item.totalPrice }}</span
          >
        </template>

        <template v-slot:[`item.paymentMethod`]="{ item }">
          <v-chip
            v-if="item.paymentMethod"
            :color="
              isRefundedOrVoided(item.status)
                ? refundedOrVoidedMopColor
                : mopColors[item.paymentMethod]
            "
            dark
            small
            class="text-overline"
            >{{ item.paymentMethod.replaceAll("_", " ") }}</v-chip
          >
        </template>

        <template v-slot:[`item.menu`]="{ item }">
          <v-menu offset-x left :disabled="isRefundedOrVoided(item.status)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                :disabled="isRefundedOrVoided(item.status)"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense class="py-0">
              <v-list-item
                class="menu-border"
                v-for="(menuItem, i) in menuItems(item.status)"
                :key="i"
                @click="() => menuItem.action(item)"
              >
                <v-list-item-title class="text-body-2 font-weight-regular">{{
                  menuItem.text
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
    refundedOrVoidedMopColor: "#CACACA",
  }),
  created() {},
  methods: {
    isRefundedOrVoided(status) {
      return status === "REFUNDED" || status === "VOIDED";
    },

    getStatusColor(status) {
      const statusColors = {
        PAID: "light-green--text text--accent-4",
        // PARTIAL: "light-green--text accent-2",
        PENDING: "primary--text",
        REFUNDED: "red--text text--accent-4",
        VOIDED: "red--text text--accent-4",
      };

      return statusColors[status];
    },

    getMenuItemPayload(item, status) {
      let payload = {};
      if (item.type === "room") {
        payload = {
          paymentStatus: status,
        };
      } else if (item.type === "addon") {
        payload = {
          addonId: item.addonId,
          addonsPaymentStatus: status,
        };
      }
      return payload;
    },

    menuItems(status) {
      if (status === "PARTIAL" || status === "PAID") {
        return [
          {
            text: "Refund Payment",
            action: (item) => {
              this.$emit(
                "transactionUpdate",
                this.getMenuItemPayload(item, "REFUNDED")
              );
            },
          },
        ];
      } else if (status === "PENDING") {
        return [
          {
            text: "Void Transaction",
            action: (item) => {
              this.$emit(
                "transactionUpdate",
                this.getMenuItemPayload(item, "VOIDED")
              );
            },
          },
        ];
      }
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
            Number(priceSummary.roomTotal) - priceSummary.finalRoomTotal
          ).toFixed(2),
          paymentMethod: "",
          time: format(parseISO(transaction.createdAt), "H:mm:ss"),
          type: "room",
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
              addonId: addon.addonId,
              type: "addon",
            }))
          : []),
      ];
    },
  },
};
</script>

<style scoped>
.menu-border {
  border-bottom: 1px solid #e6e2e2;
}
</style>
