<template>
  <div>
    <v-row class="mt-4" dense>
      <v-col cols="12">
        <FormField isBold label="Card Number">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.cardNumber"
            :rules="[
              (v) => !!v || 'Card Number is required',
              (v) => v?.length === 16 || 'Card Number must be 16 digits',
            ]"
            placeholder="0123 4567 8901 2344"
          ></v-text-field>
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
                :rules="[(v) => !!v || 'Expiry Date is required']"
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
                :rules="[(v) => !!v || 'CVC/CVV is required']"
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
export default {
  name: "CreditCardForm",
  components: { FormField },
  data: () => ({
    payload: {
      cardNumber: null,
      cardHolderName: null,
      expiration_date: null,
      cvc: null,
    },
  }),
  watch: {
    payload: {
      deep: true,
      handler: function (v) {
        this.$emit("assignPayload", v);
      },
    },
  },
};
</script>

<style scoped></style>
