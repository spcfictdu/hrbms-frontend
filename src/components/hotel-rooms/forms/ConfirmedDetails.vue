<template>
  <div>
    <HeaderBookingSlot
      @button-event="handleStatusUpdate"
      :headerData="headerData"
      :loading="loading.header"
    >
      <template #menu>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list class="py-0">
            <v-list-item
              class="menu-border"
              dense
              @click="item.action"
              v-for="(item, i) in items"
              :key="i"
            >
              <v-list-item-icon class="mr-3" v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </HeaderBookingSlot>

    <v-form @submit.prevent="handlePrinting">
      <v-row>
        <v-col cols="12" md="6">
          <!-- Checked-in/out -->
          <v-divider class="mb-2" />
          <check-in-out-details :cardTimeInformation="cardTimeInformation" />
          <FlightDetails />
        </v-col>
        <v-col cols="12" md="6">
          <!-- Booking Summary -->
          <v-divider class="mb-2" />
          <booking-summary
            ref="bookingSummary"
            :queryParams="receiptQuery"
            :clientMeta="clientMeta"
            :btnStyling="btnStyling"
          />
        </v-col>
      </v-row>
    </v-form>
    <div style="display: none">
      <ConfirmationLetter
        v-if="transactionForLetter"
        ref="confirmationLetter"
        v-bind="transactionForLetter"
      />
    </div>
  </div>
</template>

<script>
import HeaderBookingSlot from "@/components/slots/HeaderBookingSlot.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import CheckInOutDetails from "@/components/form-templates/CheckInOutDetails.vue";
import FlightDetails from "@/components/form-templates/FlightDetails.vue";
import PrintingFunction from "@/mixins/PrintingFunction";
import ConfirmationLetter from "@/components/letters/ConfirmationLetter.vue";
import { mapState } from "vuex";
import { format, parseISO } from "date-fns";
export default {
  name: "ConfirmedDetails",
  mixins: [PrintingFunction],
  components: {
    HeaderBookingSlot,
    BookingSummary,
    CheckInOutDetails,
    FlightDetails,
    ConfirmationLetter,
  },
  props: {
    value: Object,
  },
  data() {
    return {
      payload: {
        status: null,
      },
      activeButtonTitle: "Save Check-In Time",
      items: [
        {
          title: "Guest Billing",
          icon: "mdi-file-document",
          action: () =>
            this.$router.push({
              name: "Billing Report",
              params: {
                transactionRefNum: this.$route.params.referenceNumber,
              },
            }),
        },
        {
          title: "Confirmation Letter",
          icon: "mdi-printer",
          action: () => this.printLetter(),
        },
      ],
    };
  },
  methods: {
    printLetter() {
      const letterContent = this.$refs.confirmationLetter.$el;
      if (!letterContent) return;

      const parent = letterContent.parentElement;
      const originalParentDisplay = parent.style.display;
      parent.style.display = "block";

      const printWindow = window.open("", "_blank");
      const printDocument = printWindow.document;

      const clonedContent = letterContent.cloneNode(true);
      printDocument.body.appendChild(clonedContent);

      const style = printDocument.createElement("style");
      style.innerHTML = `
        @media print {
            @page {
                size: A4;
                margin: 15mm;
            }
            body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            table, tr, td, div, p, h2, h3, h4, small, a {
                page-break-inside: avoid;
            }
        }
    `;
      printDocument.head.appendChild(style);

      parent.style.display = originalParentDisplay;

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    },
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    handleStatusUpdate() {
      const {
        transactionHistory: history,
        transaction: { referenceNumber },
      } = this.value;
      const now = new Date().toISOString();
      let payload = { referenceNumber, checkInOut: true };

      if (!history.checkInDate && !history.checkInTime) {
        payload = {
          ...payload,
          checkInDate: this.formatISODate(now),
          checkInTime: this.formatISOTime(now),
        };
      } else if (!history.checkOutDate && !history.checkOutTime) {
        payload = {
          ...payload,
          checkOutDate: this.formatISODate(now),
          checkOutTime: this.formatISOTime(now),
        };
      }

      this.$emit("update-event", payload);
    },
    formatISODate: function (date) {
      return format(parseISO(date), "yyyy-MM-dd");
    },
    formatISOTime: function (date) {
      return format(parseISO(date), "HH:mm:ss");
    },
  },
  computed: {
    transactionForLetter() {
      if (!this.value || !this.room || !this.room.length) return null;
      const { transaction, priceSummary, paymentSummary, guestName, guest } =
        this.value;
      const roomData = this.room[0];

      const roomRate = roomData.roomRatesArray[0].rate;
      const extraGuestCharge = roomData.extraPersonTotal;

      const addonsTotal = priceSummary.fullAddons.reduce(
        (sum, addon) => sum + addon.total,
        0
      );
      const paymentReceived = paymentSummary.reduce(
        (sum, p) => sum + parseFloat(p.amountReceived),
        0
      );

      const discountableTotal = roomRate + extraGuestCharge;
      const discountValue = priceSummary.discount
        ? parseFloat(priceSummary.discount) / 100
        : 0;
      const discountAmount = discountableTotal * discountValue;

      const grandTotal =
        roomRate + extraGuestCharge - discountAmount + addonsTotal;
      const balance = grandTotal - paymentReceived;

      return {
        transaction: {
          ...transaction,
          guestName: guestName,
          checkIn: `${transaction.checkInDate}T${transaction.checkInTime}`,
          checkOut: `${transaction.checkOutDate}T${transaction.checkOutTime}`,
        },
        guest: guest,
        days: priceSummary.days,
        addons: priceSummary.fullAddons,
        totalRoomRate: roomRate,
        extraGuestTotal: extraGuestCharge,
        discountAmount: discountAmount,
        addonsTotal: addonsTotal,
        grandTotal: grandTotal,
        paymentReceived: paymentReceived,
        balance: balance,
      };
    },
    ...mapState("transaction", ["loading"]),
    ...mapState("roomEnum", ["room"]),
    headerData: function () {
      const { transaction, guestName, priceSummary } = this.value;
      const {
        paymentStatus,
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime,
        status,
      } = transaction;
      const { fullAddons } = priceSummary;
      const checkInDateTime = `${checkInDate}T${checkInTime}`;
      const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;
      const now = new Date();

      // Determine disabled state: false if confirmed and check-in has started, or checked-in and check-out has passed
      // const isNotWithinDate = !(
      //   (status === "CONFIRMED" && new Date(checkInDateTime) <= now) ||
      //   (status === "CHECKED-IN" && new Date(checkOutDateTime) <= now)
      // );
      const disabled = status === "CHECKED-OUT";
      // const hasOutstanding =
      //   paymentStatus === "PENDING" ||
      //   paymentStatus === "PARTIAL" ||
      //   fullAddons.some(
      //     (a) => a.paymentStatus === "PENDING" || a.paymentStatus === "PARTIAL"
      //   );
      // const disabled =
      //   isNotWithinDate || (hasOutstanding && status === "CHECKED-IN");

      return {
        client: guestName,
        from: { date: checkInDateTime },
        to: { date: checkOutDateTime },
        status: { type: status },
        button: {
          title: this.headerBtnText,
          style: { color: "primary", outlined: false },
          disabled,
        },
      };
    },
    headerBtnText: function () {
      return this.value.transaction.status === "CHECKED-IN"
        ? "Save Checked-Out Time"
        : "Save Checked-In Time";
    },
    cardTimeInformation() {
      const transactionHistory = this.value.transactionHistory;
      let checkIn = null;
      let checkOut = null;

      if (transactionHistory.checkInDate && transactionHistory.checkInTime) {
        checkIn = `${transactionHistory.checkInDate}T${transactionHistory.checkInTime}`;
      }
      if (transactionHistory.checkOutDate && transactionHistory.checkOutTime) {
        checkOut = `${transactionHistory.checkOutDate}T${transactionHistory.checkOutTime}`;
      }
      return { checkIn, checkOut };
    },
    receiptQuery: function () {
      const { transaction, room, priceSummary } = this.value;

      const receiptQuery = {
        roomType: room.name,
        roomNumber: room.number,
        roomPaymentStatus: transaction.paymentStatus,
        dateRange: [transaction.checkInDate, transaction.checkOutDate],
        extraPersonCount: transaction.extraPerson,
        addons: priceSummary.fullAddons,
        discount: priceSummary.discountName,
      };

      if (!this.value.priceSummary.discountName) {
        this.$delete(receiptQuery, "discount");
        this.$delete(receiptQuery, "voucherCode");
      }

      if (this.value.priceSummary.discountName === "VOUCHER") {
        receiptQuery.voucherCode = this.value.priceSummary.voucherCode;
      }

      return receiptQuery;
    },
    clientMeta: function () {
      const amountReceived =
        this.value.paymentSummary.reduce(
          (total, payment) => total + Number(payment.amountReceived),
          0
        ) ?? 0;

      return {
        status: this.value.transaction.status,
        clientName: this.value.guestName,
        amountReceived,
      };
    },
    btnStyling: function () {
      const btnProps = this.$route.meta.formBtn;
      return btnProps;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload.status = newVal.transaction.status;
        }
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
