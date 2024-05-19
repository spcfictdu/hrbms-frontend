<template>
  <div>
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
          <transaction-template @emit-transaction="assignPayload" />

          <!-- Guest Name -->
          <v-divider />
          <guest-name-template />

          <!-- Address -->
          <v-divider />
          <address-template />

          <!-- Contact Details -->
          <v-divider />
          <contact-details-template />

          <!-- ID -->
          <v-divider />
          <identification-template />
        </v-col>

        <!-- Right Column -->
        <v-col cols="12" md="6">
          <!-- Check In -->
          <v-divider />
          <check-in-template />

          <!-- Check Out -->
          <v-divider />
          <check-out-template />

          <!-- Guests -->
          <v-divider />
          <guests-template />

          <!-- Payment -->
          <div v-if="showPayment">
            <v-divider />
            <payment-template :isIncluded="showPayment"/>
          </div>

          <!-- Booking Summary -->
          <v-divider />
          <booking-summary :isStatus="payload.status" @validation-event="submitForValidation" />
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
export default {
  name: "BookingForm",
  data: () => ({
    valid: true,
    autofill: "Dela Cruz, Juan",
    autofillEnums: ["Dela Cruz, Juan", "Cruz, Jose Gabriel"],
    payload: {},
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
  },
  methods: {
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
        console.log("Success");
      }
    },
  },
  computed: {
    showPayment() {
      return this.payload?.status === "For Booking" ? true : false;
    },
  },
};
</script>

<style scoped></style>
