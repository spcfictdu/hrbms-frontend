<template>
  <div>
    <div
      class="d-flex justify-end align-center mb-2"
      v-if="userRole === 'ADMIN' || userRole === 'FRONT DESK'"
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
          :clearable="!readonlyInputs"
          :readonly="readonlyInputs"
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
            :readonly="readonlyInputs"
          />

          <!-- Guest Name -->
          <v-divider />
          <guest-name-template
            @emit-transaction="assignPayload"
            :fill="fill"
            :readonly="readonlyInputs"
          />

          <!-- Address -->
          <v-divider />
          <address-template
            @emit-transaction="assignPayload"
            :fill="fill"
            :readonly="readonlyInputs"
          />

          <!-- Contact Details -->
          <v-divider />
          <contact-details-template
            @emit-transaction="assignPayload"
            :fill="fill"
            :readonly="readonlyInputs"
          />

          <!-- ID -->
          <v-divider />
          <identification-template
            @emit-transaction="assignPayload"
            :fill="fill"
            :readonly="readonlyInputs"
          />

          <!-- Discount -->
          <!-- <div v-if="showDiscount">
            <v-divider />
            <DiscountTemplate @emit-transaction="assignPayload" />
          </div> -->
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="6">
          <!-- Check In -->
          <v-divider />
          <check-in-template
            :fill="fill"
            @emit-transaction="assignPayload"
            :readonly="readonlyInputs"
          />

          <!-- Check Out -->
          <v-divider />
          <check-out-template
            :fill="fill"
            @emit-transaction="assignPayload"
            :readonly="readonlyInputs"
          />

          <!-- Guests -->
          <v-divider />
          <guests-template
            :guestsEnums="extraRoomCapacity"
            :fill="fill"
            @emit-transaction="assignPayload"
            :readonly="readonlyInputs"
          />

          <v-divider />
          <ChargeDistribution
            @change="handleFolioChange"
            :guestName="guestName"
          />

          <!-- Add-Ons -->
          <div v-if="payload.status === 'RESERVED'">
            <v-divider />
            <AddOnsTemplate
              :fill="fill"
              @emit-transaction="assignPayload"
              :readonly="readonlyInputs"
            />
          </div>

          <!-- Payment -->
          <!-- <div v-if="showPayment" class="pb-8">
            <v-divider />
            <payment-template
              :fill="fill"
              :isGreater="totalPayment"
              @emit-transaction="assignPayload"
            />
          </div> -->

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
      :loading="loading.dialog"
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
import ChargeDistribution from "@/components/form-templates/ChargeDistribution.vue";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog.vue";
import WarningDialog from "@/components/dialogs/WarningDialog.vue";
import { mapActions, mapMutations, mapState } from "vuex";

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
    ChargeDistribution,
  },
  props: {
    query: Object,
    fills: Object,
    guestAutofill: Object,
    cashierUserId: Number,
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
  }),
  created() {
    if (!this.formDetails) return;

    this.fill = {
      status: this.formDetails.status,
      first_name: this.formDetails.firstName,
      middle_name: this.formDetails.middleName,
      last_name: this.formDetails.lastName,
      province: this.formDetails.address?.province,
      city: this.formDetails.address?.city,
      phone_number: this.formDetails.contact?.phoneNumber,
      email: this.formDetails.contact?.email,
      id: this.formDetails.id,
      checkInDate: this.formDetails.checkIn?.date,
      checkInTime: this.formDetails.checkIn?.time,
      checkOutDate: this.formDetails.checkOut?.date,
      checkOutTime: this.formDetails.checkOut?.time,
      extraPerson: this.formDetails.guests,
      addons: this.formDetails.addons,
    };
  },
  methods: {
    ...mapActions("transaction", ["updateTransaction", "fetchTransaction"]),
    ...mapMutations("transaction", ["SET_DIALOG"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapActions("cashier", ["fetchSessions"]),

    handleFolioChange(folioPayload) {
      if (!this.payload.room) {
        this.$set(this.payload, "room", {});
      }
      this.$set(this.payload.room, "folio", folioPayload);
      sessionStorage.setItem("formDetails", JSON.stringify(this.payload));
    },

    triggerDialog(type) {
      this.SET_DIALOG({ key: type, value: true });
    },
    resetDialog(type) {
      this.SET_DIALOG({ key: type, value: false });
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

      sessionStorage.setItem("formDetails", JSON.stringify(this.payload));
    },
    handleWhichDialog: function () {
      // this.cashierUserId = this.sessions.find((s) => {
      //   if (this.userRole === "ADMIN") return s.status === "ACTIVE";
      //   return s.userFullName === userFullName && s.status === "ACTIVE";
      //   return s.userId === this.$auth.user().userId && s.status === "ACTIVE";
      // })?.userId;

      if (this.readonlyInputs) {
        if (
          !this.user ||
          (this.userRole !== "ADMIN" && this.userRole !== "FRONT DESK")
        )
          return;

        // const userFullName = `${this.$auth.user().firstName} ${
        //   this.$auth.user().lastName
        // }`;
        this.fetchTransaction(this.guestDetailsMeta.transactionRefNum);
        this.$router.push({
          name: "Cashier",
          params: { id: String(this.cashierUserId) },
        });
        sessionStorage.removeItem("guestDetailsMeta");
        return;
      }

      if (this.$refs.form.validate()) {
        if (!this.$auth.user()) {
          this.triggerDialog("warning");
          return;
        }

        this.triggerDialog("confirmation");
      }
    },
    handleWarning: function (action) {
      let payload = {
        payload: this.payload,
        action: action,
      };

      this.$emit("onSubmit", payload);
    },

    async handleEdit() {
      this.requireAlertFn(2);

      try {
        const updatedTransaction = {
          referenceNumber: this.guestDetailsMeta.transactionRefNum,
          checkInDate: this.payload.checkIn.date,
          checkInTime: this.payload.checkIn.time,
          checkOutDate: this.payload.checkOut.date,
          checkOutTime: this.payload.checkOut.time,
          guest: {
            firstName: this.payload.firstName,
            middleName: this.payload.middleName,
            lastName: this.payload.lastName,
            address: this.payload.address,
            contact: {
              email: this.payload.contact.email,
              phoneNum: this.payload.contact.phoneNumber,
            },
            id: this.payload.id,
            extraPerson: this.payload.guests,
          },
        };
        await this.updateTransaction(updatedTransaction);

        this.$router.replace({
          name: "Confirmation",
          params: { referenceNumber: updatedTransaction.referenceNumber },
        });
      } catch (err) {
        console.error(err);
      }
    },

    handleOnConfirmed: function () {
      if (this.formDetailsAction === "Edit") {
        this.handleEdit();
      } else {
        this.$emit("onSubmit", this.payload);
      }

      sessionStorage.removeItem("guestDetailsMeta");
    },
    assignAutoFill: function (newVal) {
      const autofilledObject = this.fills.guests
        .filter((item) => item.full_name === newVal)
        .map((item) => ({
          accountId: item.id,
          city: item.city,
          email: item.email,
          first_name: item.first_name,
          last_name: item.last_name,
          middle_name: item.middle_name,
          phone_number: item.phone_number,
          province: item.province,
        }));

      const fill = autofilledObject[0];
      if (this.formDetails) {
        if (this.formDetails.status) fill.status = this.formDetails.status;

        if (this.formDetails.checkIn.date) {
          fill.checkInDate = this.formDetails.checkIn.date;
          fill.checkInTime = this.formDetails.checkIn.time;
        }

        if (this.formDetails.checkOut.date) {
          fill.checkOutDate = this.formDetails.checkOut.date;
          fill.checkOutTime = this.formDetails.checkOut.time;
        }

        if (this.formDetails.id && Object.keys(this.formDetails.id).length) {
          fill.id = {
            type: this.formDetails.id.type,
            number: this.formDetails.id.number,
          };
        }

        fill.extraPerson = this.formDetails.guests;
      }

      this.fill = fill;
      this.payload.accountId = fill.accountId;
      this.$refs.form.resetValidation();
    },
    resetAutoFill: function () {
      this.fill = null;
      delete this.payload.accountId;
      this.$refs.form.resetValidation();

      // Reset payload
      this.payload = {
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
      };

      sessionStorage.removeItem("formDetails");
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
    ...mapState("transaction", ["loading", "dialog"]),
    ...mapState("vouchers", ["activeVoucher"]),
    ...mapState("cashier", ["sessions"]),

    formDetails() {
      return JSON.parse(sessionStorage.getItem("formDetails"));
    },

    guestDetailsMeta() {
      return JSON.parse(sessionStorage.getItem("guestDetailsMeta"));
    },

    userRole: function () {
      return this.$auth.user()?.role;
    },

    guestName() {
      const { firstName, middleName, lastName } = this.payload;
      if (lastName && firstName) {
        return middleName
          ? `${lastName}, ${firstName} ${middleName}`
          : `${lastName}, ${firstName}`;
      }
      return "";
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
      if (this.formDetailsAction === "Edit")
        return {
          title: "Edit",
          outlined: false,
        };

      if (this.readonlyInputs)
        return {
          title: "Back to Cashier",
          outlined: false,
        };

      return {
        title:
          this.payload.status === "CONFIRMED"
            ? "Record Booking"
            : "Record Reservation",
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

      if (this.userRole === "ADMIN" || this.userRole === "FRONT DESK") {
        statuses.push({
          status: "For Booking",
          value: "CONFIRMED",
        });
      }
      return statuses;
    },
    confirmationMeta: function () {
      if (!this.cashierUserId && this.payload.status === "CONFIRMED") {
        return {
          actionType: "No Cashier Session Open!",
          titleClasses: "primary--text",
          message: "Open a Cashier Session?",
        };
      }

      const status =
        this.payload.status === "CONFIRMED" ? "booking" : "reservation";

      if (this.formDetailsAction) {
        return {
          action: this.formDetailsAction,
          actionType: status,
          message: "Are you sure you want to edit your reservation?",
        };
      }

      const message =
        this.$auth.user()?.role === "ADMIN"
          ? `Are you sure you want to proceed with the ${status}?`
          : `Are you sure you want to proceed with the ${status}? If you save the reservation, personnel will be automatically notified that the room is hosting guests`;
      return {
        action: "Save",
        actionType: status,
        message,
      };
    },

    hasFills() {
      return !!Object.keys(this.fills).length;
    },

    formDetailsAction() {
      return this.guestDetailsMeta?.action;
    },

    readonlyInputs() {
      return this.formDetailsAction === "View";
    },

    user: function () {
      return this.$auth.user();
    },

    userRole: function () {
      return this.$auth.user()?.role;
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

        this.payload.roomNumber = newVal.roomNumber;
      },
    },
    "payload.status": {
      deep: true,
      handler: function (newVal) {
        if (newVal === "RESERVED") {
          this.payload.payment.amountReceived = null;
          this.payload.payment.paymentType = null;
        }
        if (newVal === "CONFIRMED") {
          this.payload.addons = [];
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
    fills() {
      if (!this.formDetails) return;
      const { firstName, middleName, lastName } = this.formDetails;

      const fullName = middleName
        ? `${lastName}, ${firstName} ${middleName}`
        : `${lastName}, ${firstName}`;

      if (this.fills.guests.find((g) => g.full_name === fullName))
        this.autofill = fullName;
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
