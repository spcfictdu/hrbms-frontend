<template>
  <div v-if="this.room">
    <div
      class="d-flex justify-end align-center mb-2"
      v-if="$auth.user().role === 'FRONT DESK'"
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
          <identification-template @emit-transaction="assignPayload" />
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="6">
          <!-- Check In -->
          <v-divider />
          <check-in-template
            :filledDate="payload.checkIn.date"
            @emit-transaction="assignPayload"
          />

          <!-- Check Out -->
          <v-divider />
          <check-out-template
            :filledDate="payload.checkOut.date"
            @emit-transaction="assignPayload"
          />

          <!-- Guests -->
          <v-divider />
          <guests-template
            :guestsEnums="guestsEnums"
            @emit-transaction="assignPayload"
          />

          <!-- Payment -->
          <div v-if="showPayment" class="pb-8">
            <v-divider />
            <payment-template
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
            :cardInformation="cardInformation"
            @validation-event="submitForValidation"
          />
        </v-col>
      </v-row>
    </v-form>
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
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingForm",
  props: ["queryResult", "fillResult"],
  data: () => ({
    valid: true,
    autofill: "",
    autoFilled: null,
    statuses: [
      {
        status: "For Reservation",
        value: "RESERVED",
      },
      {
        status: "For Booking",
        value: "CONFIRMED",
      },
    ],
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
  },
  methods: {
    ...mapActions("roomEnum", ["fetchRoom"]),
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    submitForValidation: function () {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.$emit("validation-event", this.payload);
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
        const autofilledObject = this.fillResult.guests.filter(
          (item) => item.full_name === newVal
        );
        this.autoFilled = autofilledObject[0];
      } else {
        this.autoFilled = null;
      }
    },
    assignGuestMeta: function () {
      if (this.$auth.user().role === "GUEST") {
        this.autoFilled = {
          first_name: this.userInfo.firstName,
          middle_name: this.userInfo.middleName,
          last_name: this.userInfo.lastName,
          phone_number: this.userInfo.phone,
          email: this.userInfo.email,
          city: this.userInfo.address.city,
          province: this.userInfo.address.province,
        };
      }
      console.log(this.autoFilled);
    },
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    ...mapState("account", {
      userInfo: "userInfo",
    }),
    showPayment() {
      return this.payload?.status === "CONFIRMED" ? true : false;
    },
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
  },
  watch: {
    queryResult: {
      immediate: true,
      handler: function (newVal) {
        this.payload.room = {
          referenceNumber: newVal.referenceNumber,
        };
        if (newVal.checkInDate && newVal.checkOutDate) {
          this.payload.checkIn.date = newVal.checkInDate;
          this.payload.checkOut.date = newVal.checkOutDate;
        }

        this.fetchQuery();
        this.assignGuestMeta();
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
  },
};
</script>

<style scoped></style>
