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
        <FormField isBold label="Bank">
          <v-select
            outlined
            dense
            hide-details="auto"
            :items="banks"
            item-text="name"
            item-value="id"
            v-model="selectedBankId"
            @change="handleOnBankChange"
            :rules="[(v) => !!v || 'Bank is required']"
          />
        </FormField>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FormField from "@/components/fields/FormField.vue";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "ChequeForm",
  components: { FormField },
  data: () => ({
    selectedBankId: null,
    payload: {
      chequeNumber: null,
      chequeBankName: "",
      bankId: null,
    },
  }),
  watch: {
    payload: {
      deep: true,
      handler(v) {
        this.$emit("assignPayload", v);
      },
    },
  },
  methods: {
    ...mapActions("banks", ["fetchBanks"]),
    handleOnBankChange() {
      this.payload.bankId = this.selectedBankId;
      this.payload.chequeBankName = this.getBank(this.selectedBankId)?.name;
    },
  },
  computed: {
    ...mapState("banks", ["banks"]),
    ...mapGetters("banks", ["getBank"]),
  },
  created() {
    this.fetchBanks();
  },
};
</script>

<style scoped></style>
