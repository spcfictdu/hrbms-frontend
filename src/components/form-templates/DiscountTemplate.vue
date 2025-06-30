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
            @change="SET_ACTIVE_VOUCHER(null)"
          />
        </FormField>
      </v-col>
      <v-col cols="12" v-show="!!payload.discount">
        <FormField>
          <v-text-field
            ref="idNumberInput"
            dense
            outlined
            hide-details="auto"
            :placeholder="`Enter your ${placeholders[payload.discount]}`"
            v-model="payload.idNumber"
            @input="payload.idNumber = payload.idNumber.toLocaleUpperCase()"
            @blur="validateVoucher"
            v-mask="idNumberMask(payload.discount)"
          />
        </FormField>
      </v-col>
    </v-row>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
import { mask } from "vue-the-mask";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "DiscountTemplate",
  components: { FormSection, FormField },
  directives: { mask },
  data: () => ({
    payload: {
      discount: null,
      idNumber: null,
    },
    discounts: [
      { text: "Senior Citizen", value: "SNR" },
      { text: "PWD", value: "PWD" },
      { text: "Voucher", value: "VOUCHER" },
    ],

    placeholders: {
      SNR: "Senior Citizen ID number",
      PWD: "PWD ID number",
      VOUCHER: "voucher code",
    },

    secondParam: {
      SNR: "idNumber",
      PWD: "idNumber",
      VOUCHER: "voucherCode",
    },
  }),
  methods: {
    ...mapMutations("vouchers", ["SET_ACTIVE_VOUCHER"]),
    handleInput() {
      payload.idNumber = payload.idNumber.toLocaleUpperCase();
      this.validateVoucher();
    },
    validateVoucher() {
      if (this.payload.discount !== "VOUCHER") return;

      const voucher = this.getVoucher(this.payload.idNumber);
      if (!voucher || voucher.status !== "ACTIVE" || voucher.usage < 1) {
        this.SET_ACTIVE_VOUCHER(null);
        return;
      }
      this.SET_ACTIVE_VOUCHER(voucher);
    },
    idNumberMask(idType) {
      const mask = {
        SNR: "######",
        PWD: "##-####-###-#######",
      };
      return mask[idType] ?? "XXXXXXXXXXXXXXXX";
    },
  },
  computed: {
    ...mapGetters("vouchers", ["getVoucher"]),
  },
  watch: {
    "payload.discount": function () {
      this.$refs.idNumberInput.$refs.input.value = "";
      this.payload.idNumber = null;
    },
    payload: {
      deep: true,
      handler: function (v) {
        const nullPayload = {
          discount: null,
          idNumber: null,
          voucherCode: null,
        };

        const finalPayload = {
          discount: v.discount,
          [this.secondParam[v.discount]]: v.idNumber,
        };

        const isVoucher = v.discount === "VOUCHER";
        if (!isVoucher) finalPayload.voucherCode = null;

        const isDefault = Object.values(v).every((v) => v);

        this.$emit("emit-transaction", isDefault ? finalPayload : nullPayload);
      },
    },
  },
};
</script>

<style scoped></style>
