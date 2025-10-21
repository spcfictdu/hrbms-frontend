<template>
  <v-card flat>
    <CashierTransactionDetailsTableHeader :tableHead="headerDetails" />

    <div class="px-5 pb-5">
      <DefaultTable
        :headers="headers"
        :items="mappedPayment"
        :footerProps="footerProps"
        hideDefaultFooter
      >
        <template v-slot:[`item.status`]="{ item }">
          <span :class="getStatusColor(item.status)" class="font-weight-medium">
            {{ item.status }}
          </span>
        </template>

        <template v-slot:[`item.product`]="{ item }">
          <span :class="getItemClass(item.status)">
            {{ item.product }}
          </span>
        </template>

        <template v-slot:[`item.quantity`]="{ item }">
          <span :class="getItemClass(item.status)">
            {{ item.quantity }}
          </span>
        </template>

        <template v-slot:[`item.totalPrice`]="{ item }">
          <span :class="getItemClass(item.status)">
            {{ item.totalPrice }}
          </span>
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
                v-for="(menuItem, i) in menuItems(item)"
                :key="i"
                @click="() => menuItem.action(item)"
              >
                <v-list-item-title class="text-body-2 font-weight-regular">
                  {{ menuItem.text }}
                </v-list-item-title>
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
  name: "CashierPaymentDetailsTable",
  components: { DefaultTable, CashierTransactionDetailsTableHeader },
  props: { data: Object, menuItems: Array },
  data: () => ({
    footerProps: {
      itemsPerPageOptions: [5, 10, 15],
    },
  }),
  methods: {
    isRefundedOrVoided(status) {
      return status === "REFUNDED" || status === "VOIDED";
    },

    getStatusColor(status) {
      const statusColors = {
        PAID: "cash--text",
        // PARTIAL: "light-green--text accent-2",
        PENDING: "primary--text",
        REFUNDED: "red--text text--accent-4",
        VOIDED: "red--text text--accent-4",
      };

      return statusColors[status] || "";
    },

    getItemClass(status) {
      return this.isRefundedOrVoided(status)
        ? "text-decoration-line-through"
        : "";
    },
  },

  computed: {
    headers() {
      const baseHeaders = [
        { text: "Status", value: "status" },
        { text: "Product", value: "product" },
        { text: "Price", value: "price" },
        { text: "Quantity", value: "quantity" },
        { text: "Total Price", value: "totalPrice" },
        { text: "Discount", value: "discount" },
        { text: "Time", value: "time" },
      ];

      const mode = this.$route.query.mode;
      if (mode === "edit") {
        baseHeaders.push({
          text: "",
          value: "menu",
          sortable: false,
        });
      }

      return baseHeaders;
    },

    headerDetails() {
      const guestName = this.data?.guestName || "";
      const referenceNumber = this.data?.referenceNumber || "";
      let timestamp;
      if (this.data?.room) {
        timestamp = this.data.room.timestamp;
      } else if (this.data?.addons?.length > 0) {
        timestamp = this.data.addons[0].timestamp;
      }
      const date = timestamp ? format(parseISO(timestamp), "MMMM d, yyyy") : "";

      return {
        "Guest Name": guestName,
        "Reference Number": referenceNumber,
        Date: date,
      };
    },

    mappedPayment() {
      if (!this.data) return [];

      const items = [];
      if (this.data.room) {
        const {
          paymentStatus,
          roomType,
          unitPrice,
          quantity,
          totalPrice,
          discount,
          timestamp,
        } = this.data.room;
        items.push({
          paymentStatus,
          product: roomType,
          unitPrice,
          quantity,
          totalPrice,
          discount,
          timestamp,
        });
      }
      if (this.data.addons?.length > 0) {
        items.push(
          ...this.data.addons.map((a) => ({
            paymentStatus: a.paymentStatus,
            product: a.name,
            unitPrice: a.unitPrice,
            quantity: a.quantity,
            totalPrice: a.totalPrice,
            discount: a.discount,
            timestamp: a.timestamp,
          })),
        );
      }

      return items.map((item) => {
        const {
          paymentStatus: status,
          product,
          unitPrice: price,
          quantity,
          totalPrice,
          discount,
          timestamp,
        } = item;
        const time = format(parseISO(timestamp), "H:mm:ss");
        return {
          status,
          product,
          price: Number(price).toFixed(2),
          quantity,
          totalPrice,
          discount: Number(discount || 0).toFixed(2),
          time,
        };
      });
    },
  },
};
</script>
