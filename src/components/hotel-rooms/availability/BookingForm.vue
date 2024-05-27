<template>
  <div v-if="this.room">
    <div class="d-flex justify-end align-center mb-2">
      <div>
        <v-select
          class="d-block"
          rounded
          dense
          filled
          background-color="lightBg"
          hide-details="auto"
          :items="autofillEnums"
          v-model="autofill"
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
          <guest-name-template @emit-transaction="assignPayload" />

          <!-- Address -->
          <v-divider />
          <address-template @emit-transaction="assignPayload" />

          <!-- Contact Details -->
          <v-divider />
          <contact-details-template @emit-transaction="assignPayload" />

          <!-- ID -->
          <v-divider />
          <identification-template @emit-transaction="assignPayload" />
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="6">
          <!-- Check In -->
          <v-divider />
          <check-in-template @emit-transaction="assignPayload" />

          <!-- Check Out -->
          <v-divider />
          <check-out-template @emit-transaction="assignPayload" />

          <!-- Guests -->
          <v-divider />
          <guests-template @emit-transaction="assignPayload" />

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
import GCashImageTransition from "@/components/hotel-rooms/availability/GCashImageTransition.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingForm",
  props: ["queryResult"],
  data: () => ({
    valid: true,
    autofill: "Dela Cruz, Juan",
    autofillEnums: ["Dela Cruz, Juan", "Cruz, Jose Gabriel"],
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
    fetchQuery: function (newVal) {
      let query = {
        roomType: newVal.room.type,
        roomNumber: newVal.room.details.roomNumber,
      };
      this.fetchRoom(query);
    },
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    showPayment() {
      return this.payload?.status === "CONFIRMED" ? true : false;
    },
    cardInformation() {
      const room = this.room ? this.room[0] : null;

      // Assign the Guests to a variable
      const additionalGuests = this.payload.guests ? this.payload.guests : 0;

      // Compute the total additional guests price
      const extraPersonTotal = room.extraPersonTotal * additionalGuests;

      // Total Bill
      const total = room.roomTotal + room.extraPersonTotal * additionalGuests;
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
          extraPersonTotal: extraPersonTotal,
          total: total,
          totalReceived: totalReceived,
          totalOutstanding: totalOutstanding,
          totalChange: totalChange,
        },
        button: {
          title: "Save Reservation",
          outlined: false,
        },
      };
    },
    showScan() {
      return this.payload.payment?.paymentType === "GCash" ? true : false;
    },
  },
  watch: {
    queryResult: {
      immediate: true,
      handler: function (newVal) {
        this.payload.room = {
          referenceNumber: newVal.room.details.referenceNumber,
        };
        this.fetchQuery(newVal);
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
  },
};
</script>

<style scoped></style>
