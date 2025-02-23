<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Payment </template>
    </title-slot>

    <v-row>
      <v-col cols="12" :md="isAdmin ? 6 : 0" v-if="isAdmin">
        <v-btn
          depressed
          block
          :color="buttonOne === activeButton ? 'primary' : 'lightBg'"
          height="100%"
          class="text-capitalize py-2"
          :class="{
            'font-weight-medium': buttonOne === activeButton,
            'font-weight-regular': buttonOne !== activeButton,
          }"
          @click="assignActiveButton(buttonOne)"
          ><v-avatar color="white" size="30" class="mr-2">
            <v-icon color="primary" dense>mdi-cash</v-icon> </v-avatar
          >Cash</v-btn
        >
      </v-col>
      <v-col cols="12" :md="isAdmin ? 6 : 0">
        <v-btn
          depressed
          block
          :color="buttonTwo === activeButton ? 'primary' : 'lightBg'"
          height="100%"
          class="font-weight-regular text-capitalize py-2"
          :class="{
            'font-weight-medium': buttonTwo === activeButton,
            'font-weight-regular': buttonTwo !== activeButton,
          }"
          @click="assignActiveButton(buttonTwo)"
          ><v-avatar color="white" size="30" class="mr-2">
            <v-img
              contain
              width="20"
              height="20"
              :src="imgSrc"
            ></v-img> </v-avatar
          >GCash</v-btn
        >
      </v-col>
    </v-row>

    <div class="mt-4">
      <label-slot>
        <template v-slot:label> Amount Received </template>
      </label-slot>
      <v-text-field
        type="number"
        dense
        hide-details="auto"
        outlined
        :rules="rules.amountReceived"
        v-model.number="payload.payment.amountReceived"
        @change="emitTransaction"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "PaymentTemplate",
  props: {
    isGreater: {
      type: Number,
      required: true,
    },
    fill: Object,
  },
  data: () => ({
    activeButton: "",
    buttonOne: "CASH",
    buttonTwo: "GCASH",
    payload: {
      payment: {
        paymentType: null,
        amountReceived: 0,
      },
    },
    imgSrc: require("@/assets/GCashLogo.png"),
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {
    assignActiveButton: function (string) {
      this.activeButton = string;
      this.payload.payment.paymentType = string;
      this.emitTransaction();
    },
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },
  },
  computed: {
    rules() {
      const errors = {};
      // errors.type = [(v) => !!v || "Type is required"];
      errors.amountReceived = [
        !!this.payload.payment.paymentType || "Type is required",
        (v) => !!v || "Amount is required",
        (v) => v >= this.isGreater || "Amount should be greater than total",
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
  },
};
</script>

<style scoped></style>
