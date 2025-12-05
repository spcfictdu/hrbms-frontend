<template>
  <div>
    <HeaderBookingSlot
      @button-event="dialog.cancel = true"
      :headerData="headerData"
      :loading="loading.cancel"
    >
    </HeaderBookingSlot>

    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="handleTransactionUpdate"
    >
      <v-row>
        <v-col cols="12" md="6">
          <v-divider class="mb-2" />
          <FlightDetails />
        </v-col>
        <v-col cols="12" md="6">
          <v-divider class="mb-2" />
          <BookingSummary
            ref="bookingSummary"
            :loading="loading.form"
            :queryParams="receiptQuery"
            :clientMeta="clientMeta"
            :btnStyling="btnStyling"
            @totalPayment="(v) => (totalPayment = v)"
          />
        </v-col>
      </v-row>
    </v-form>

    <ConfirmationDialog
      :opened="dialog.confirmation"
      :onClose="() => (dialog.confirmation = false)"
      :meta="confirmationMeta"
      @onProceed="$emit('confirmReservation')"
    />
    <DeleteDialog
      :opened="dialog.cancel"
      :onClose="() => (dialog.cancel = false)"
      message="reservation"
      :loading="getLoading('cancel')"
      action="Cancel"
      headerAction="Cancel"
      @onDelete="handleCancelButton"
    />
  </div>
</template>

<script>
import HeaderBookingSlot from "../../slots/HeaderBookingSlot.vue";
import FlightDetails from "@/components/form-templates/FlightDetails.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import { mapState, mapGetters } from "vuex";
import DeleteDialog from "@/components/dialogs/DeleteDialog.vue";

export default {
  name: "ConfirmationForm",
  components: {
    HeaderBookingSlot,
    FlightDetails,
    BookingSummary,
    ConfirmationDialog,
    DeleteDialog,
  },
  props: {
    cashierUserId: Number,
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
    dialog: {
      confirmation: false,
      cancel: false,
    },
    confirmationMeta: {
      actionType: "No Cashier Session Open!",
      message: "Open a Cashier Session?",
      titleClasses: "primary--text",
    },
  }),
  methods: {
    assignPayload(payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },

    handleTransactionUpdate() {
      if (this.$auth.user()?.role === "GUEST") {
        this.$emit("print");
        return;
      }

      // Assign Variables
      const { referenceNumber, status } = this.value.transaction;
      const { payment } = this.payload;

      let payload = {
        referenceNumber,
        status,
        ...payment,
      };

      if (this.$refs.form.validate()) {
        if (!this.cashierUserId) {
          this.dialog.confirmation = true;
          return;
        }
        this.$emit("confirmReservation", payload);
      }
    },
    handleCancelButton() {
      const params = {
        status: this.value.transaction.status,
        transactionRefNum: this.value.transaction.referenceNumber,
      };
      this.$emit("cancel", params);
    },
  },
  computed: {
    ...mapState("transaction", ["loading"]),
    ...mapGetters("transaction", ["getLoading"]),

    headerData() {
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
    receiptQuery() {
      return {
        roomType: this.value.room.name,
        roomNumber: this.value.room.number,
        dateRange: [
          this.value.transaction.checkInDate,
          this.value.transaction.checkOutDate,
        ],
        extraPersonCount: this.value.transaction.extraPerson,
        addons: this.value.priceSummary.fullAddons,
      };
    },
    clientMeta() {
      return {
        status: this.value.transaction.status,
        clientName: this.value.guestName,
        amountReceived: this.payload.payment.amountReceived,
      };
    },
    btnStyling() {
      const btnProps = this.$route.meta.formBtn;
      return btnProps;
    },
    isStaff() {
      const role = this.$auth.user()?.role;
      return role === "ADMIN" || role === "FRONT DESK";
    },
  },
};
</script>
