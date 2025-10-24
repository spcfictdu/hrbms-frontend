<template>
  <div>
    <v-skeleton-loader type="table" v-if="loading" />

    <v-card v-else flat>
      <CashierTransactionDetailsTableHeader :tableHead="headerDetails" />

      <div class="px-5 pb-5">
        <DefaultTable
          :headers="headers"
          :items="mappedTransactionDetails"
          :footerProps="footerProps"
          hideDefaultFooter
          :itemsPerPage="-1"
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
                isRefundedOrVoided(item.status) &&
                'text-decoration-line-through'
              "
              >{{ item.product }}</span
            >
          </template>

          <template v-slot:[`item.quantity`]="{ item }">
            <span
              :class="
                isRefundedOrVoided(item.status) &&
                'text-decoration-line-through'
              "
              >{{ item.quantity }}</span
            >
          </template>

          <template v-slot:[`item.totalPrice`]="{ item }">
            <span
              :class="
                isRefundedOrVoided(item.status) &&
                'text-decoration-line-through'
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
            <v-menu
              offset-x
              bottom
              right
              :disabled="isRefundedOrVoided(item.status)"
            >
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

    <ChargeDistributionDialog
      v-if="chargeDistributionDialog"
      ref="chargeDistributionDialog"
      v-model="chargeDistributionDialog"
      :itemAmount="itemAmount"
      :guestName="transactionDetails?.guestName"
      :existing-charges="existingCharges"
      @save="handleChargeDistributionSave"
      :loading="chargeDistributionLoading"
    />
  </div>
</template>

<script>
import DefaultTable from "@/components/tables/DefaultTable.vue";
import CashierTransactionDetailsTableHeader from "./CashierTransactionDetailsTableHeader.vue";
import ChargeDistributionDialog from "@/components/dialogs/ChargeDistributionDialog.vue";
import { format, parseISO } from "date-fns";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "CashierTransactionDetalisTable",
  components: {
    DefaultTable,
    CashierTransactionDetailsTableHeader,
    ChargeDistributionDialog,
  },
  props: { transactionDetails: Object, loading: Boolean },
  data() {
    return {
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
      chargedItem: null,
      itemAmount: 0,
      existingCharges: null,
      chargeDistributionDialog: false,
      chargeDistributionLoading: false,
    };
  },
  methods: {
    ...mapMutations("cashier", ["SET_DIALOG"]),
    ...mapActions("transaction", ["updateFolio", "fetchTransaction"]),

    async handleChargeDistributionSave(savedPayload) {
      function enhanceFolioAttributes(folio) {
        if ("type" in folio && !("folioType" in folio)) {
          folio.folioType = folio.type;
          delete folio.type;
        }

        ["folioA", "folioB", "folioC", "folioD"].forEach((key) => {
          const obj = folio[key];
          if (obj) {
            if ("charge" in obj && !("amount" in obj)) obj.amount = 0;
            if ("amount" in obj && !("charge" in obj)) obj.charge = 0;
            // Set/add name attribute to null if not present
            if (!("name" in obj)) {
              obj.name = null;
            }
          }
        });

        return folio;
      }

      const payload = enhanceFolioAttributes(savedPayload.folio);
      switch (this.chargedItem.type) {
        case "room": {
          payload.referenceNumber =
            this.transactionDetails?.transaction?.referenceNumber;
          break;
        }
        case "addon": {
          payload.bookingAddonId = this.chargedItem.addonId;
        }
      }

      this.chargeDistributionLoading = true;
      try {
        await this.updateFolio(payload);
        this.fetchTransaction(
          this.transactionDetails?.transaction.referenceNumber
        );
        this.chargedItem = null;
        this.existingCharges = null;
        this.chargeDistributionDialog = false;
        this.$refs.chargeDistributionDialog.resetForm();
      } catch (err) {
        console.error(err);
      } finally {
        this.chargeDistributionLoading = false;
      }
    },

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

    formatExistingCharges(existingCharge) {
      if (existingCharge.type === "INDIVIDUAL") return null;

      const letters = ["b", "c", "d"];
      const folios = [{}];
      let chargeDistributionType = "PERCENT";

      letters.forEach((letter) => {
        const nameKey = `folio_${letter}_name`;
        const chargeKey = `folio_${letter}_charge`;
        const amountKey = `folio_${letter}_amount`;

        const name = existingCharge[nameKey] || "";
        const chargeVal = parseFloat(existingCharge[chargeKey] * 100) || 0;
        const amountVal = parseFloat(existingCharge[amountKey]) || 0;

        let charge = null;
        let amount = null;
        if (amountVal !== 0) {
          amount = amountVal;
          chargeDistributionType = "FIXED_AMOUNT";
        } else if (chargeVal !== 0) {
          charge = chargeVal;
        }

        folios.push({ name, charge, amount });
      });

      return { folios, chargeDistributionType };
    },

    menuItems({ status, type }) {
      const isFrontDeskUser = this.$auth.user()?.role === "FRONT DESK";

      const showDialog = () => {
        if (isFrontDeskUser) {
          this.SET_DIALOG({ key: "adminPasscode", value: true });
        } else {
          this.SET_DIALOG({ key: "confirmation", value: true });
        }
      };

      const menuItems = [
        {
          text: "Charge Distribution",
          action: (item) => {
            this.chargedItem = item;
            this.itemAmount = Number(item.totalPrice);
            if (item.type === "room") {
              this.existingCharges = this.formatExistingCharges(
                this.transactionDetails?.transaction?.roomCharges
              );
            } else if (item.type === "addon") {
              const addon =
                this.transactionDetails?.priceSummary?.fullAddons?.find(
                  (a) => a.addonId === item.addonId
                );
              this.existingCharges = this.formatExistingCharges(addon?.charges);
            }
            this.chargeDistributionDialog = true;
          },
        },
      ];

      if (
        status === "PARTIAL" ||
        status === "PAID" ||
        (type === "room" && Number(this.headerDetails.totalPayment) > 0)
      ) {
        menuItems.push({
          text: "Refund Payment",
          action: (item) => {
            showDialog();

            this.$emit("menuSelect", {
              payload: this.getMenuItemPayload(item, "REFUNDED"),
              confirmationDialogMeta: {
                action: "Refund",
                actionType: "Payment?",
              },
            });
          },
        });
      } else if (status === "PENDING") {
        menuItems.push({
          text: "Void Transaction",
          action: (item) => {
            showDialog();

            this.$emit("menuSelect", {
              payload: this.getMenuItemPayload(item, "VOIDED"),
              confirmationDialogMeta: {
                action: "Void",
                actionType: "Transaction?",
              },
            });
          },
        });
      }
      return menuItems;
    },
  },

  computed: {
    ...mapState("roomEnum", ["room"]),

    headers() {
      const baseHeaders = [
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
          text: "Time",
          value: "time",
        },
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

    extraPersonTotal() {
      const extraPersonTotal = this.isRefundedOrVoided(
        this.transaction?.transaction.paymentStatus
      )
        ? 0
        : this.room?.[0]?.roomRatesArray?.reduce(
            (total, room) => total + room.extraPersonRate,
            0
          );

      return extraPersonTotal || 0;
    },

    headerDetails() {
      const totalValidAddons =
        this.transactionDetails?.priceSummary.fullAddons.reduce(
          (total, addon) => {
            if (addon.paymentStatus === "VOIDED") return total;
            return total + addon.total;
          },
          0
        );

      const totalWithoutAddons =
        this.transactionDetails?.priceSummary.finalRoomTotal +
        (this.room?.[0]?.extraPersonTotal || 0);

      const totalPurchase = totalWithoutAddons + totalValidAddons;

      return {
        "Guest Name": this.transactionDetails?.guestName,
        "Reference Number":
          this.transactionDetails?.transaction.referenceNumber,
        "Total Purchase": totalPurchase.toFixed(2),
        Date:
          this.transactionDetails &&
          format(
            parseISO(this.transactionDetails.transaction.createdAt),
            "MMMM dd, yyyy"
          ),
      };
    },

    mappedTransactionDetails() {
      if (!this.transactionDetails) return;

      const { transaction, room, priceSummary } = this.transactionDetails;
      const discountPercentage =
        (this.room?.[0]?.discount?.split("%")[0] || 0) * 0.01;
      return [
        {
          status: transaction.paymentStatus,
          product: room.name,
          price: priceSummary.roomTotal,
          quantity: transaction.extraPerson + 1,
          totalPrice: (
            Number(priceSummary.roomTotal) + this.extraPersonTotal
          ).toFixed(2),
          discount: (
            (Number(priceSummary.roomTotal) + this.extraPersonTotal) *
            discountPercentage
          ).toFixed(2),
          time: format(parseISO(transaction.createdAt), "H:mm:ss"),
          type: "room",
        },
        ...(priceSummary.fullAddons.length
          ? priceSummary.fullAddons.map((addon) => ({
              status: addon.paymentStatus,
              product: addon.name,
              price: addon.unitPrice,
              quantity: addon.quantity,
              totalPrice: addon.total,
              discount: "0.00",
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
