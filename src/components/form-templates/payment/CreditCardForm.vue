<template>
  <div>
    <v-row dense class="mt-4">
      <v-col cols="12">
        <FormField isBold label="Card Number">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.cardNumber"
          ></v-text-field>
        </FormField>
      </v-col>
      <v-col cols="12">
        <FormField isBold label="Card Name">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.cardName"
          ></v-text-field>
        </FormField>
      </v-col>
      <v-col cols="12" md="6">
        <FormField isBold label="Expiry Date">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.expiryDate"
          ></v-text-field>
        </FormField>
      </v-col>
      <v-col cols="12" md="6">
        <FormField isBold label="CVC/CVV">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.cvcOrCvv"
          ></v-text-field>
        </FormField>
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
      cardName: null,
      expiryDate: null,
      cvcOrCvv: null,
    },
  }),
};
</script>

<style scoped></style>
