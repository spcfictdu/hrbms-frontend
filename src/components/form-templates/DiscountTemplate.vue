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
            item-value="value"
            v-model="payload.discount"
          />
        </FormField>
      </v-col>
      <v-col cols="12" v-show="!!payload.discount">
        <FormField>
          <v-text-field
            dense
            outlined
            hide-details="auto"
            :placeholder="`Enter your ${placeholders[payload.discount]}`"
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

    placeholders: {
      SENIOR: "Senior Citizen ID number",
      PWD: "PWD ID number",
      VOUCHER: "voucher code",
    },

    secondParam: {
      SENIOR: "idNumber",
      PWD: "idNumber",
      VOUCHER: "voucherCode",
    },
  }),
  watch: {
    "payload.discount": function () {
      this.payload.idNumber = null;
    },
    payload: {
      deep: true,
      handler: function (v) {
        const nullPayload = {
          discount: null,
          idNumber: null,
          vouchercode: null,
        };

        const finalPayload = {
          discount: v.discount,
          [this.secondParam[v.discount]]: v.idNumber,
        };

        const isDefault = Object.values(v).every((v) => v);

        this.$emit("emit-transaction", isDefault ? finalPayload : nullPayload);
      },
    },
  },
};
</script>

<style scoped></style>
