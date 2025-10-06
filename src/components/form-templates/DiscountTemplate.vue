<template>
  <FormSection title="Discount">
    <v-row>
      <v-col cols="12">
        <FormField label="Discount Type">
          <v-select
            dense
            outlined
            hide-details="auto"
            placeholder="Select a discount type"
            clearable
            :items="discounts"
            item-text="text"
            item-value="value"
            v-model="payload.discount"
            @change="handleDiscountChange"
            :disabled="disabled"
          />
        </FormField>
      </v-col>
      <v-col cols="12" v-show="!!payload.discount">
        <FormField
          :label="payload.discount === 'VOUCHER' ? 'Voucher Code' : 'ID Number'"
        >
          <v-text-field
            ref="idNumberInput"
            dense
            outlined
            hide-details="auto"
            :rules="rules"
            :placeholder="idNumberPlaceholder(payload.discount)"
            v-model="payload.idNumber"
            @input="payload.idNumber = payload.idNumber.toLocaleUpperCase()"
            @blur="validateVoucher"
            v-mask="idNumberMask(payload.discount)"
            :disabled="disabled"
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
  props: { fill: Object },
  directives: { mask },
  data: () => ({
    payload: {
      discount: null,
      idNumber: null,
    },

    disabled: false,

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

    handleDiscountChange() {
      this.SET_ACTIVE_VOUCHER(null);
      this.$refs.idNumberInput.$refs.input.value = "";
      this.payload.idNumber = null;
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
      const masks = {
        SNR: "################",
        PWD: "##-####-###-#######",
      };
      return masks[idType] ?? "XXXXXXXXXXXXXXXX";
    },

    idNumberPlaceholder(idType) {
      const placeholoders = {
        SNR: "001234",
        PWD: "13-5416-000-0000001",
        VOUCHER: "Voucher Code",
      };
      return placeholoders[idType] ?? "";
    },

    idInputLengthRules(idType) {
      let placeholderLength = this.idNumberPlaceholder(idType)?.length;
      let minCharacterCount = placeholderLength;

      switch (idType) {
        case "SNR":
          placeholderLength = 3;
          minCharacterCount = 3;
          break;
        case "PWD":
          minCharacterCount = 16;
          break;
      }

      const rule = {
        requiredLength: placeholderLength,
        errorMessage: `Min ${minCharacterCount} characters`,
      };

      return rule;
    },
  },
  computed: {
    ...mapGetters("vouchers", ["getVoucher"]),

    rules() {
      if (!this.payload.discount || this.payload.discount === "VOUCHER")
        return [];

      const { requiredLength, errorMessage } = this.idInputLengthRules(
        this.payload.discount
      );
      return [
        (v) =>
          (!!this.payload.discount && (v?.length >= requiredLength || !v)) ||
          errorMessage,
      ];
    },
  },
  watch: {
    fill(val) {
      if (!Object.values(val.discount).every((v) => !!v)) {
        this.disabled = false;
        return;
      }

      this.payload = val.discount;
      this.disabled = true;
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
