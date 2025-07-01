<template>
  <FormSection title="Payment">
    <v-row>
      <v-col cols="12" md="6" v-for="button in buttons" :key="button.text">
        <v-btn
          depressed
          block
          :color="button.value === activeButton ? 'primary' : 'lightBg'"
          height="100%"
          class="text-caption font-weight-regular text-capitalize py-2"
          :class="{
            'font-weight-medium': button.value === activeButton,
          }"
          @click="assignActiveButton(button.value)"
        >
          <div class="d-flex align-center" style="gap: 8px; min-width: 100px">
            <v-avatar color="white" size="30">
              <v-icon color="primary" dense v-if="button.icon">{{
                button.icon
              }}</v-icon>
              <v-img
                v-if="button.img"
                contain
                width="20"
                height="20"
                :src="button.img"
              ></v-img>
            </v-avatar>
            <div>{{ button.text }}</div>
          </div>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Type Fields -->
    <ChequeForm
      @assignPayload="assignPayload"
      v-if="activeButton === 'CHEQUE'"
    />
    <CreditCardForm
      @assignPayload="assignPayload"
      v-if="activeButton === 'CREDIT_CARD'"
    />

    <FormField label="Amount Received" class="mt-4">
      <v-text-field
        type="number"
        dense
        hide-details="auto"
        outlined
        :rules="rules.amountReceived"
        v-model.number="payload.payment.amountReceived"
        hide-spin-buttons
      ></v-text-field>
    </FormField>

    <GCashImageTransition class="mt-4" :showScan="activeButton === 'GCASH'" />
  </FormSection>
</template>

<script>
import GCashImageTransition from "../hotel-rooms/forms/GCashImageTransition.vue";
import ChequeForm from "./payment/ChequeForm.vue";
import CreditCardForm from "./payment/CreditCardForm.vue";
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "PaymentTemplate",
  components: {
    FormSection,
    FormField,
    GCashImageTransition,
    ChequeForm,
    CreditCardForm,
  },
  props: {
    fill: Object,
  },
  data: () => ({
    activeButton: "",
    buttons: [
      {
        text: "Cash",
        value: "CASH",
        icon: "mdi-cash",
      },
      {
        text: "GCash",
        value: "GCASH",
        img: require("@/assets/GCashLogo.svg"),
      },
      {
        text: "Cheque",
        value: "CHEQUE",
        img: require("@/assets/BankCheque.svg"),
      },
      {
        text: "Credit Card",
        value: "CREDIT_CARD",
        img: require("@/assets/CreditCard.svg"),
      },
    ],
    payload: {
      payment: {
        paymentType: null,
        amountReceived: 0,
      },
    },
  }),
  methods: {
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload.payment, key, payload[key]);
        }
      }
    },
    assignActiveButton: function (string) {
      this.activeButton = string;
      this.payload.payment.paymentType = string;
    },
    resetPayload: function (v) {
      this.payload.payment = {
        paymentType: v,
        amountReceived: 0,
      };
    },
  },
  computed: {
    rules: function () {
      const errors = {};
      errors.amountReceived = [
        !!this.payload.payment.paymentType || "Type is required",
        (v) =>
          (this.payload.payment.paymentType === "CASH" && (v === 0 || !!v)) ||
          "Amount is required",
      ];
      return errors;
    },
    isAdmin: function () {
      return this.$auth.user()?.role === "ADMIN";
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.payment) {
          this.payload.payment = {
            paymentType: newVal.payment.paymentType,
            amountReceived: newVal.payment.amountReceived,
          };
          this.activeButton = newVal.payment.paymentType;
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.payment = {
            paymentType: null,
            amountReceived: null,
          };
        }
      },
    },
    payload: {
      deep: true,
      handler: function (v) {
        this.$emit("emit-transaction", v);
      },
    },
    "payload.payment.paymentType": {
      handler: function (v) {
        this.resetPayload(v);
      },
    },
  },
};
</script>

<style scoped></style>
