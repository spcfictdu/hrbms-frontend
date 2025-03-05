<template>
  <FormSection title="Discount">
    <v-row>
      <v-col cols="12">
        <FormField>
          <v-select
            dense
            outlined
            hide-details="auto"
            placeholder="Select Discount"
            clearable
            :items="discounts"
            item-text="text"
            v-model="payload.discount"
          />
        </FormField>
      </v-col>
      <v-col cols="12">
        <FormField>
          <v-text-field
            dense
            outlined
            hide-details="auto"
            placeholder="Enter your ID number"
            v-model="payload.idNumber"
          />
        </FormField>
      </v-col>
    </v-row>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "DiscountTemplate",
  components: { FormSection, FormField },
  data: () => ({
    payload: {
      discount: null,
      idNumber: null,
    },
    discounts: [
      { text: "Senior Citizen", value: "SENIOR" },
      { text: "PWD", value: "PWD" },
      { text: "Voucher", value: "VOUCHER" },
    ],
  }),
  watch: {
    "payload.discount": function () {
      this.payload.idNumber = null;
    },
  },
};
</script>

<style scoped></style>
