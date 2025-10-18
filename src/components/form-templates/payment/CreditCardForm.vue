<template>
  <div>
    <v-row class="mt-4" dense>
      <v-col>
        <v-divider></v-divider>
      </v-col>

      <v-col class="d-flex" :style="{ gap: '.5rem' }" cols="12">
        <v-img
          class="flex-grow-0"
          v-for="src in cardIcons"
          :key="src"
          contain
          width="36"
          height="36"
          :src="src"
        ></v-img>
      </v-col>

      <v-col cols="12">
        <FormField isBold label="Bank">
          <v-select
            outlined
            dense
            hide-details="auto"
            :items="banks"
            item-text="name"
            item-value="id"
            v-model="payload.bankId"
            :rules="[(v) => !!v || 'Bank is required']"
          />
        </FormField>
      </v-col>

      <v-col cols="12">
        <FormField isBold label="Card Number">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="formattedCardNumber"
            :rules="[
              (v) => !!v || 'Card Number is required',
              (v) => v?.length === 19 || 'Card Number must be 16 digits',
            ]"
            placeholder="0123 4567 8901 2344"
            v-mask="'#### #### #### ####'"
          >
            <template v-slot:prepend-inner>
              <v-icon class="mr-1 px-1" v-if="!cardType"
                >mdi-credit-card-outline</v-icon
              >
              <v-img
                v-if="!!cardType"
                class="mr-1 mt-n1"
                contain
                width="32"
                height="32"
                :src="cardIcons[cardType]"
              ></v-img>
            </template>
          </v-text-field>
        </FormField>
      </v-col>
      <v-col cols="12">
        <FormField isBold label="Card Holder Name">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.cardHolderName"
            :rules="[(v) => !!v || 'Card Holder  is required']"
            @input="
              payload.cardHolderName =
                payload.cardHolderName.toLocaleUpperCase()
            "
            placeholder="JUAN DELA CRUZ"
          ></v-text-field>
        </FormField>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="6">
            <FormField isBold label="Expiry Date">
              <v-text-field
                dense
                hide-details="auto"
                outlined
                v-model="payload.expiration_date"
                placeholder="MM/YY"
                v-mask="'##/##'"
                :rules="[
                  (v) => (!!v && v?.length === 5) || 'Expiry Date is required',
                  (v) => pattern.test(v) || 'Invalid expiration date',
                ]"
              ></v-text-field>
            </FormField>
          </v-col>
          <v-col cols="12" md="6">
            <FormField isBold label="CVC/CVV">
              <v-text-field
                dense
                hide-details="auto"
                outlined
                v-model="payload.cvc"
                placeholder="123"
                v-mask="'####'"
                :rules="[
                  (v) => (!!v && v?.length >= 3) || 'CVC/CVV is required',
                ]"
              ></v-text-field>
            </FormField>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FormField from "@/components/fields/FormField.vue";
import { mask } from "vue-the-mask";
import { mapActions, mapState } from "vuex";

export default {
  name: "CreditCardForm",
  components: { FormField },
  directives: { mask },
  data: () => ({
    formattedCardNumber: "",
    payload: {
      cardNumber: null,
      cardHolderName: null,
      expirationDate: null,
      bankId: null,
      cvc: null,
    },
    pattern: /^(?:0[1-9]|1[0-2])\/\d{2}$/,
    cardIcons: {
      visa: require("@/assets/visa-icon.svg"),
      mastercard: require("@/assets/mastercard-icon.svg"),
    },
  }),
  computed: {
    ...mapState("banks", ["banks"]),
    unmaskedCardNumber() {
      return this.formattedCardNumber?.replace(/\D/g, "");
    },

    cardType() {
      const cardNumber = this.unmaskedCardNumber;

      if (/^4/.test(cardNumber)) {
        return "visa";
      } else if (/^5[1-5]/.test(cardNumber)) {
        return "mastercard";
      }
      return null;
    },
  },
  watch: {
    payload: {
      deep: true,
      handler: function (v) {
        const newPayload = {
          ...v,
          cardNumber: this.unmaskedCardNumber,
        };
        this.$emit("assignPayload", newPayload);
      },
    },
  },
  methods: {
    ...mapActions("banks", ["fetchBanks"]),
  },
  created() {
    this.fetchBanks();
  },
};
</script>

<style scoped></style>
