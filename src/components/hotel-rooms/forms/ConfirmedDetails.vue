<template>
  <div>
    <header-booking-slot
      @button-event="handleStatusUpdate"
      :headerData="headerData"
      :loading="loading.header"
    />

    <v-form @submit.prevent="handlePrinting">
      <v-row>
        <v-col cols="12" md="6">
          <!-- Checked-in/out -->
          <v-divider />
          <check-in-out-details :cardTimeInformation="cardTimeInformation" />
        </v-col>
        <v-col cols="12" md="6">
          <!-- Booking Summary -->
          <v-divider></v-divider>
          <booking-summary
            ref="bookingSummary"
            :queryParams="receiptQuery"
            :clientMeta="clientMeta"
            :btnStyling="btnStyling"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import HeaderBookingSlot from "@/components/slots/HeaderBookingSlot.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import CheckInOutDetails from "@/components/form-templates/CheckInOutDetails.vue";
import PrintingFunction from "@/mixins/PrintingFunction";
import { mapState } from "vuex";
import { format, parseISO } from "date-fns";
export default {
  name: "ConfirmedDetails",
  mixins: [PrintingFunction],
  components: {
    HeaderBookingSlot,
    BookingSummary,
    CheckInOutDetails,
  },
  props: {
    value: Object,
  },
  data: () => ({
    payload: {
      status: null,
    },
    activeButtonTitle: "Save Check-In Time",
  }),
  methods: {
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
      let payload = { referenceNumber };

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
    ...mapState("transaction", ["loading"]),
    headerData: function () {
      const { transaction, guestName } = this.value;
      const { checkInDate, checkInTime, checkOutDate, checkOutTime, status } =
        transaction;
      const checkInDateTime = `${checkInDate}T${checkInTime}`;
      const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;
      const now = new Date();

      // Determine disabled state: false if confirmed and check-in has started, or checked-in and check-out has passed
      const disabled = !(
        (status === "CONFIRMED" && new Date(checkInDateTime) <= now) ||
        (status === "CHECKED-IN" && new Date(checkOutDateTime) <= now)
      );

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
      const receiptQuery = {
        roomType: this.value.room.name,
        roomNumber: this.value.room.number,
        dateRange: [
          this.value.transaction.checkInDate,
          this.value.transaction.checkOutDate,
        ],
        extraPersonCount: this.value.transaction.extraPerson,
        addons: this.value.priceSummary.fullAddons,
        discount: this.value.priceSummary.discountName,
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

<style scoped></style>
