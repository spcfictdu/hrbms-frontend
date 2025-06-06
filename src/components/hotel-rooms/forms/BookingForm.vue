<template>
  <div>
    <div
      class="d-flex justify-end align-center mb-2"
      v-if="userRole === 'ADMIN'"
    >
      <div style="max-width: 300px">
        <v-select
          class="d-block"
          rounded
          dense
          filled
          background-color="lightBg"
          hide-details="auto"
          :items="fills.guests"
          item-text="full_name"
          v-model="autofill"
          clearable
        ></v-select>
      </div>
    </div>

    <v-form lazy-validation ref="form" @submit.prevent="handleWhichDialog">
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="6">
          <!-- Transactions -->
          <v-divider />
          <transaction-template
            :statuses="statuses"
            @emit-transaction="assignPayload"
            :fill="fill"
          />

          <!-- Guest Name -->
          <v-divider />
          <guest-name-template @emit-transaction="assignPayload" :fill="fill" />

          <!-- Address -->
          <v-divider />
          <address-template @emit-transaction="assignPayload" :fill="fill" />

          <!-- Contact Details -->
          <v-divider />
          <contact-details-template
            @emit-transaction="assignPayload"
            :fill="fill"
          />

          <!-- ID -->
          <v-divider />
          <identification-template
            @emit-transaction="assignPayload"
            :fill="fill"
          />

          <!-- Discount -->
          <div v-if="showDiscount">
            <v-divider />
            <DiscountTemplate @emit-transaction="assignPayload" />
          </div>
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="6">
          <!-- Check In -->
          <v-divider />
          <check-in-template :fill="fill" @emit-transaction="assignPayload" />

          <!-- Check Out -->
          <v-divider />
          <check-out-template :fill="fill" @emit-transaction="assignPayload" />

          <!-- Guests -->
          <v-divider />
          <guests-template
            :guestsEnums="extraRoomCapacity"
            :fill="fill"
            @emit-transaction="assignPayload"
          />

          <!-- Add-Ons -->
          <v-divider />
          <AddOnsTemplate :fill="fill" @emit-transaction="assignPayload" />

          <!-- Payment -->
          <div v-if="showPayment" class="pb-8">
            <v-divider />
            <payment-template
              :fill="fill"
              :isGreater="totalPayment"
              @emit-transaction="assignPayload"
            />
          </div>

          <!-- Booking Summary -->
          <v-divider />
          <booking-summary
            :loadingMeta="loading.dialog"
            :queryParams="receiptQuery"
            :clientMeta="clientMeta"
            :btnStyling="btnStyling"
            @capacity="(v) => (extraRoomCapacity = v)"
            @totalPayment="evaluateTotalPayment"
          />
        </v-col>
      </v-row>
    </v-form>
    <ConfirmationDialog
      :opened="dialog.confirmation"
      :onClose="() => resetDialog('confirmation')"
      :meta="confirmationMeta"
      :loading="loading.dialog"
      @onProceed="handleOnConfirmed"
    />
    <WarningDialog
      :opened="dialog.warning"
      :onClose="() => resetDialog('warning')"
      @onDecision="handleWarning"
    />
  </div>
</template>

<script>
import TransactionTemplate from "@/components/form-templates/TransactionTemplate.vue";
import GuestNameTemplate from "@/components/form-templates/GuestNameTemplate.vue";
import AddressTemplate from "@/components/form-templates/AddressTemplate.vue";
import ContactDetailsTemplate from "@/components/form-templates/ContactDetailsTemplate.vue";
import IdentificationTemplate from "@/components/form-templates/IdentificationTemplate.vue";
import CheckInTemplate from "@/components/form-templates/CheckInTemplate.vue";
import CheckOutTemplate from "@/components/form-templates/CheckOutTemplate.vue";
import GuestsTemplate from "@/components/form-templates/GuestsTemplate.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import PaymentTemplate from "@/components/form-templates/PaymentTemplate.vue";
import AddOnsTemplate from "@/components/form-templates/AddOnsTemplate.vue";
import DiscountTemplate from "@/components/form-templates/DiscountTemplate.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import WarningDialog from "@/components/dialogs/WarningDialog.vue";
import { mapState } from "vuex";
export default {
  name: "BookingForm",
  components: {
    TransactionTemplate,
    GuestNameTemplate,
    AddressTemplate,
    ContactDetailsTemplate,
    IdentificationTemplate,
    CheckInTemplate,
    CheckOutTemplate,
    GuestsTemplate,
    BookingSummary,
    PaymentTemplate,
    ConfirmationDialog,
    WarningDialog,
    AddOnsTemplate,
    DiscountTemplate,
  },
  props: {
    query: Object,
    fills: Object,
    guestAutofill: Object,
  },
  data: () => ({
    autofill: "",
    fill: null,
    payload: {
      payment: {
        paymentType: null,
        amountReceived: 0,
      },
      checkIn: {
        date: null,
      },
      checkOut: {
        date: null,
      },
      guests: 0,
    },
    totalPayment: 0,

    // Enums
    extraRoomCapacity: [],

    // Dialogs
    dialog: {
      confirmation: false,
      warning: false,
    },
  }),

  methods: {
    triggerDialog: function (type) {
      this.dialog[type] = true;
    },
    resetDialog: function (type) {
      this.dialog[type] = false;
    },
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const value = payload[key];
          if (value === null) {
            this.$delete(this.payload, key);
          } else {
            this.$set(this.payload, key, payload[key]);
          }
        }
      }
    },
    handleWhichDialog: function () {
      if (this.$refs.form.validate()) {
        if (this.$auth.user()) {
          this.triggerDialog("confirmation");
        } else {
          this.triggerDialog("warning");
        }
      }
    },
    handleWarning: function (action) {
      let payload = {
        payload: this.payload,
        action: action,
      };

      this.$emit("onSubmit", payload);
      this.resetDialog("warning");
    },
    handleOnConfirmed: function () {
      this.$emit("onSubmit", this.payload);

      if (this.$auth.user()) {
        this.resetDialog("confirmation");
      }
    },
    assignAutoFill: function (newVal) {
      const autofilledObject = this.fills.guests
        .filter((item) => item.full_name === newVal)
        .map((item) => ({
          id: item.id,
          city: item.city,
          email: item.email,
          first_name: item.first_name,
          last_name: item.last_name,
          middle_name: item.middle_name,
          phone_number: item.phone_number,
          province: item.province,
        }));

      this.fill = autofilledObject[0];
      this.payload.accountId = autofilledObject[0].id;
      this.$refs.form.resetValidation();
    },
    resetAutoFill: function () {
      this.fill = null;
      delete this.payload.accountId;
      this.$refs.form.resetValidation();
    },
    autofillDates: function (newVal) {
      this.fill = {
        ...this.fill,
        checkInDate: newVal.checkInDate,
        checkOutDate: newVal.checkOutDate,
      };
    },
    evaluateTotalPayment: function (total) {
      this.totalPayment = total;
      this.payload.roomTotal = total;
    },
  },
  computed: {
    ...mapState("transaction", ["loading"]),
    userRole: function () {
      return this.$auth.user()?.role;
    },

    // Payment Computed State
    showPayment() {
      return this.payload?.status === "CONFIRMED" ? true : false;
    },
    showDiscount: function () {
      return this.payload?.status == "CONFIRMED";
    },

    // Receipt Computed State
    receiptQuery: function () {
      const hasDate = this.payload.checkIn.date && this.payload.checkOut.date;
      return {
        roomType: this.query.room,
        roomNumber: this.query.roomNumber,
        dateRange: hasDate
          ? [this.payload.checkIn.date, this.payload.checkOut.date]
          : [],
        extraPersonCount: this.payload.guests,
        addons: this.payload.addons ?? [],
      };
    },
    clientMeta: function () {
      return {
        status: this.payload.status,
        clientName:
          this.payload.lastName && this.payload.firstName
            ? `${this.payload.lastName}, ${this.payload.firstName} ${
                this.payload.middleName ?? ""
              }`
            : "Please Type",
        amountReceived: this.payload.payment?.amountReceived ?? 0,
      };
    },
    btnStyling: function () {
      return {
        title:
          this.payload.status === "CONFIRMED"
            ? "Record Payment"
            : "Save Reservation",
        outlined: false,
      };
    },

    // Enums
    statuses: function () {
      let statuses = [
        {
          status: "For Reservation",
          value: "RESERVED",
        },
      ];

      if (this.userRole === "ADMIN") {
        statuses.push({
          status: "For Booking",
          value: "CONFIRMED",
        });
      }
      return statuses;
    },
    confirmationMeta: function () {
      const message =
        this.$auth.user()?.role === "ADMIN"
          ? "Are you sure you want to proceed with the reservation?"
          : "Are you sure you want to proceed with the reservation? If you save the reservation, personnel will be automatically notified that the room is hosting guests";
      return {
        action: "Save",
        actionType: "Reservation",
        message,
      };
    },
  },
  watch: {
    query: {
      immediate: true,
      handler: function (newVal) {
        this.payload.room = {
          referenceNumber: newVal.referenceNumber,
        };

        if (newVal.checkInDate && newVal.checkOutDate) {
          this.autofillDates(newVal);

          this.payload.checkIn.date = newVal.checkInDate;
          this.payload.checkOut.date = newVal.checkOutDate;
        }
      },
    },
    "payload.status": {
      deep: true,
      handler: function (newVal) {
        if (newVal === "RESERVED") {
          this.payload.payment.amountReceived = null;
          this.payload.payment.paymentType = null;
        }
      },
    },
    autofill: {
      handler: function (newVal) {
        if (newVal) {
          this.assignAutoFill(newVal);
        } else {
          this.resetAutoFill();
        }
      },
    },
    guestAutofill: {
      immediate: true,
      handler: function (newVal) {
        this.fill = {
          ...this.fill,
          ...newVal,
        };
      },
    },
  },
};
</script>

<style scoped></style>
