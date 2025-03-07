<template>
  <div>
    <v-row dense class="mt-4">
      <v-col cols="12"
        ><FormField isBold label="Cheque Number">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.chequeNumber"
            :rules="[(v) => !!v || 'Cheque Number is required']"
          ></v-text-field> </FormField
      ></v-col>
      <v-col cols="12">
        <FormField isBold label="Bank Name">
          <v-text-field
            dense
            hide-details="auto"
            outlined
            v-model="payload.chequeBankName"
            :rules="[(v) => !!v || 'Bank Name is required']"
          ></v-text-field> </FormField
      ></v-col>
    </v-row>
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
      chequeBankName: null,
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
