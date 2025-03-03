<template>
  <div>
    <header-booking-slot
      @button-event="handleCancelButton"
      :headerData="headerData"
      :loadingMeta="loading.cancel"
    >
    </header-booking-slot>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="handleTransactionUpdate"
    >
      <v-row>
        <v-col cols="12" md="6" v-if="isAdmin">
          <!-- Transaction -->
          <v-divider />
          <transaction-template
            :statuses="statuses"
            @emit-transaction="assignPayload"
          />

          <!-- Payment -->
          <v-divider />
          <payment-template
            :isGreater="totalPayment"
            @emit-transaction="assignPayload"
          />

          <!-- GCash QR Code Transition -->
          <g-cash-image-transition :showScan="showScan" />
        </v-col>
        <v-col cols="12" :md="isAdmin ? 6 : 12">
          <!-- Booking Summary -->
          <v-divider />
          <BookingSummary
            :loading="loading.form"
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
import TransactionTemplate from "@/components/form-templates/TransactionTemplate.vue";
import HeaderBookingSlot from "../../slots/HeaderBookingSlot.vue";
import PaymentTemplate from "@/components/form-templates/PaymentTemplate.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import GCashImageTransition from "./GCashImageTransition.vue";
import { mapState } from "vuex";
export default {
  name: "ConfirmationForm",
  components: {
    HeaderBookingSlot,
    TransactionTemplate,
    PaymentTemplate,
    BookingSummary,
    GCashImageTransition,
  },
  props: {
    value: Object,
  },
  data: () => ({
    payload: {
      payment: {
        amountReceived: 0,
        paymentType: null,
      },
    },
    statuses: [
      {
        status: "For Reservation & Confirmation",
        value: "CONFIRMED",
      },
    ],
    totalPayment: 0,
  }),
  methods: {
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    handleTransactionUpdate: function () {
      // Assign Variables
      const referenceNumber = this.value.transaction.referenceNumber;

      let payload = {
        referenceNumber: referenceNumber,
        paymentType: this.payload.payment.paymentType,
        amountReceived: this.payload.payment.amountReceived,
        status: this.value.transaction.status,
      };

      if (this.$refs.form.validate()) {
        this.$emit("onSubmit", payload);
      }
    },
    handleCancelButton: function () {
      let params = {
        status: this.value.transaction.status,
        transactionRefNum: this.value.transaction.referenceNumber,
      };
      this.$emit("onCancel", params);
    },
  },
  computed: {
    ...mapState("transaction", ["loading"]),
    headerData: function () {
      return {
        client: this.value.guestName,
        from: {
          date: `${this.value.transaction.checkInDate}T${this.value.transaction.checkInTime}`,
        },
        to: {
          date: `${this.value.transaction.checkOutDate}T${this.value.transaction.checkOutTime}`,
        },
        status: {
          type: this.value.transaction.status,
        },
        button: {
          title: "Cancel Reservation",
          style: {
            color: "warning",
            outlined: true,
          },
        },
      };
    },
    showScan() {
      return this.payload.payment?.paymentType === "GCASH" ? true : false;
    },
    receiptQuery: function () {
      return {
        roomType: this.value.room.name,
        roomNumber: this.value.room.number,
        dateRange: [
          this.value.transaction.checkInDate,
          this.value.transaction.checkOutDate,
        ],
        extraPersonCount: this.value.transaction.extraPerson,
      };
    },
    clientMeta: function () {
      return {
        status: this.value.transaction.status,
        clientName: this.value.guestName,
        amountReceived: this.payload.payment.amountReceived,
      };
    },
    btnStyling: function () {
      const btnProps = this.$route.meta.formBtn;
      return btnProps;
    },
    isAdmin: function () {
      return this.$auth.user()?.role === "ADMIN";
    },
  },
};
</script>

<style scoped></style>
