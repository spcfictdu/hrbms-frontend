<template>
  <div v-if="this.room">
    <div
      class="d-flex justify-end align-center mb-2"
      v-if="$auth.user()?.role === 'ADMIN'"
    >
      <div style="max-width: 300px">
        <v-select
          class="d-block"
          rounded
          dense
          filled
          background-color="lightBg"
          hide-details="auto"
          :items="fillResult.guests"
          item-text="full_name"
          v-model="autofill"
          clearable
        ></v-select>
      </div>
    </div>

    <v-form lazy-validation v-model="valid" ref="form">
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="6">
          <!-- Transactions -->
          <v-divider />
          <transaction-template
            :statuses="statuses"
            @emit-transaction="assignPayload"
            :fill="autoFilled"
          />

          <!-- Guest Name -->
          <v-divider />
          <guest-name-template
            @emit-transaction="assignPayload"
            :fill="autoFilled"
          />

          <!-- Address -->
          <v-divider />
          <address-template
            @emit-transaction="assignPayload"
            :fill="autoFilled"
          />

          <!-- Contact Details -->
          <v-divider />
          <contact-details-template
            @emit-transaction="assignPayload"
            :fill="autoFilled"
          />

          <!-- ID -->
          <v-divider />
          <identification-template
            @emit-transaction="assignPayload"
            :fill="autoFilled"
          />
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="6">
          <!-- Check In -->
          <v-divider />
          <check-in-template
            :fill="autoFilled"
            @emit-transaction="assignPayload"
          />

          <!-- Check Out -->
          <v-divider />
          <check-out-template
            :fill="autoFilled"
            @emit-transaction="assignPayload"
          />

          <!-- Guests -->
          <v-divider />
          <guests-template
            :guestsEnums="guestsEnums"
            :fill="autoFilled"
            @emit-transaction="assignPayload"
          />

          <!-- Payment -->
          <div v-if="showPayment" class="pb-8">
            <v-divider />
            <payment-template
              :fill="autoFilled"
              :isGreater="totalPayment"
              @emit-transaction="assignPayload"
            />

            <!-- GCash QR Code Transition -->
            <g-cash-image-transition :showScan="showScan" />
          </div>

          <!-- Booking Summary -->
          <v-divider />
          <booking-summary
            :isStatus="payload.status"
            :loadingMeta="loadingMeta"
            :cardInformation="cardInformation"
            @validation-event="handleConfirmationEvent"
          />
        </v-col>
      </v-row>
    </v-form>
    <confirmation-dialog
      :activator="confirmMeta.activator"
      :metaDialog="confirmMeta"
      @reset-activator="resetDialog('CONFIRM')"
      @change-event="submitForValidation"
    />
    <warning-dialog
      :activator="warningDialog"
      @reset-activator="resetDialog('WARNING')"
      @change-event="submitForValidationWarning"
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
import GCashImageTransition from "@/components/hotel-rooms/forms/GCashImageTransition.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import WarningDialog from "@/components/dialogs/WarningDialog.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingForm",
  props: ["queryResult", "fillResult", "guestAutofill"],
  data: () => ({
    valid: true,
    autofill: "",
    autoFilled: null,
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
    },
    totalPayment: 0,
    confirmMeta: {
      activator: false,
      action: "Save",
      actionType: "Reservation",
      message: "",
    },
    warningDialog: false,
  }),
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
    GCashImageTransition,
    ConfirmationDialog,
    WarningDialog,
  },
  methods: {
    ...mapActions("roomEnum", ["fetchRoom"]),
    triggerDialog: function (dialog) {
      if (dialog === "CONFIRM") {
        this.confirmMeta.activator = true;
      } else if (dialog === "WARNING") {
        this.warningDialog = true;
      }
    },
    resetDialog: function (dialog) {
      if (dialog === "CONFIRM") {
        this.confirmMeta.activator = false;
      } else if (dialog === "WARNING") {
        this.warningDialog = false;
      }
    },
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    handleConfirmationEvent: function () {
      if (this.$refs.form.validate()) {
        if (this.$auth.user()) {
          this.triggerDialog("CONFIRM");
        } else {
          this.triggerDialog("WARNING");
        }
      }
    },
    submitForValidationWarning: function (action) {
      let payload = {
        payload: this.payload,
        action: action,
      };

      this.$emit("validation-event", payload);
      this.resetDialog("WARNING");
    },
    submitForValidation: function () {
      this.$emit("validation-event", this.payload);

      if (this.$auth.user()) {
        this.resetDialog("CONFIRM");
      }
    },
    fetchQuery: function () {
      let query = {
        roomType: this.queryResult.room,
        roomNumber: this.queryResult.roomNumber,
      };

      if (this.queryResult.checkInDate && this.queryResult.checkOutDate) {
        query.dateRange = [
          this.queryResult.checkInDate,
          this.queryResult.checkOutDate,
        ];
      }

      if (this.payload.checkIn?.date && this.payload.checkOut?.date) {
        query.dateRange = [
          this.payload.checkIn.date,
          this.payload.checkOut.date,
        ];
      } else {
        delete query.dateRange;
      }
      if (this.payload.guests) {
        query.extraPersonCount = this.payload.guests;
      } else {
        delete query.extraPersonCount;
      }
      this.fetchRoom(query);
    },
    filterGuest: function (newVal) {
      if (newVal) {
        const autofilledObject = this.fillResult.guests
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
        this.autoFilled = autofilledObject[0];
        this.payload.accountId = autofilledObject[0].id;
      } else {
        this.autoFilled = null;
        delete this.payload.accountId;
      }
    },
    assignDates: function (newVal) {
      if (newVal.checkInDate && newVal.checkOutDate) {
        this.autoFilled = {
          ...this.autoFilled,
          checkInDate: newVal.checkInDate,
          checkOutDate: newVal.checkOutDate,
        };
      }
    },
    assignConfirmationMessages: function () {
      if (this.$auth.user()?.role === "ADMIN") {
        this.confirmMeta.message =
          "Are you sure you want to proceed with the reservation";
      } else {
        this.confirmMeta.message =
          "Are you sure you want to proceed with the reservation? If you save the reservation, personnel will be automatically notified that the room is hosting guests";
      }
    },
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    ...mapState("account", {
      userInfo: "userInfo",
    }),
    ...mapState("transaction", {
      loadingMeta: "meta",
    }),
    showPayment() {
      return this.payload?.status === "CONFIRMED" ? true : false;
    },

    // Receipt
    cardInformation() {
      const room = this.room ? this.room[0] : null;

      // Total Bill
      const total = room.roomTotalWithExtraPerson;
      this.totalPayment = total;

      // Total Received
      const totalReceived = this.payload.payment
        ? this.payload.payment.amountReceived
        : 0;

      // Total Outstanding Bill
      const totalOutstanding =
        total - totalReceived < 0 ? 0 : total - totalReceived;

      // Total Change
      const totalChange = totalReceived > total ? totalReceived - total : 0;

      return {
        client:
          this.payload.lastName && this.payload.firstName
            ? `${this.payload.lastName ? this.payload.lastName : ""}, ${
                this.payload.firstName ? this.payload.firstName : ""
              } ${this.payload.middleName ? this.payload.middleName : ""}`
            : "Please Type",
        room: {
          type: room.roomType,
          roomName: room.roomNumber,
          capacity: room.roomTypeCapacity,
          roomFloor: room.roomFloor,
        },
        payment: {
          roomTotal: room.roomTotal,
          extraPersonTotal: room.extraPersonTotal,
          total: room.roomTotalWithExtraPerson,
          roomRatesArray: room.roomRatesArray,
          totalReceived: totalReceived,
          totalOutstanding: totalOutstanding,
          totalChange: totalChange,
        },
        button: {
          title:
            this.payload.status === "CONFIRMED"
              ? "Record Payment"
              : "Save Reservation",
          outlined: false,
        },
      };
    },
    showScan() {
      return this.payload.payment?.paymentType === "GCASH" ? true : false;
    },
    guestsEnums() {
      return this.room ? this.room[0].extraPersonCapacity : [];
    },
    statuses: function () {
      let statuses = [
        {
          status: "For Reservation",
          value: "RESERVED",
        },
      ];

      if (this.$auth.user()?.role === "ADMIN") {
        statuses.push({
          status: "For Booking",
          value: "CONFIRMED",
        });
      }
      return statuses;
    },
  },
  watch: {
    queryResult: {
      immediate: true,
      handler: function (newVal) {
        this.payload.room = {
          referenceNumber: newVal.referenceNumber,
        };
        this.assignDates(newVal);
        this.assignConfirmationMessages();
        this.fetchQuery();
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
    "payload.checkIn.date": {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.fetchQuery();
        }
      },
    },
    "payload.checkOut.date": {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.fetchQuery();
        }
      },
    },
    "payload.guests": {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.fetchQuery();
        }
      },
    },
    autofill: {
      deep: true,
      handler: function (newVal) {
        this.filterGuest(newVal);
      },
    },
    guestAutofill: {
      immediate: true,
      handler: function (newVal) {
        this.autoFilled = {
          ...this.autoFilled,
          ...newVal,
        };
      },
    },
  },
};
</script>

<style scoped></style>
