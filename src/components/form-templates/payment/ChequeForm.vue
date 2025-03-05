<template>
  <div>
    <FormField isBold label="Cheque Number" class="mt-4">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        v-model="payload.chequeNumber"
      ></v-text-field>
    </FormField>

    <FormField isBold label="Bank Name" class="mt-4">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        v-model="payload.bankName"
      ></v-text-field>
    </FormField>
  </div>
</template>

<script>
import FormField from "@/components/fields/FormField.vue";
export default {
  name: "ChequeForm",
  components: { FormField },
  data: () => ({
    payload: {
      chequeNumber: null,
      bankName: null,
    },
  }),
};
</script>

<style scoped></style>
