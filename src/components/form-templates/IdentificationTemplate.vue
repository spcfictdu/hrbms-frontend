<template>
  <FormSection title="ID">
    <v-row>
      <v-col cols="12" md="6">
        <FormField label="Type">
          <v-select
            hide-details="auto"
            outlined
            dense
            :items="IdEnums"
            :rules="rules.type"
            v-model="payload.id.type"
            @change="handleTypeChange"
            :readonly="readonly"
          ></v-select>
        </FormField>
      </v-col>
      <v-col cols="12" md="6">
        <FormField label="ID Number">
          <v-text-field
            ref="idNumberInput"
            dense
            hide-details="auto"
            outlined
            :rules="rules.IdNumber"
            v-model="payload.id.number"
            @change="emitTransaction"
            @input="payload.id.number = payload.id.number.toLocaleUpperCase()"
            v-mask="idNumberMask(payload.id.type)"
            :readonly="readonly"
            :placeholder="idNumberPlaceholder(payload.id.type)"
          ></v-text-field>
        </FormField>
      </v-col>
    </v-row>
  </FormSection>
</template>

<script>
import FormField from "../fields/FormField.vue";
import FormSection from "../sections/FormSection.vue";
import { mask } from "vue-the-mask";
export default {
  name: "IdentificationTemplate",
  components: {
    FormSection,
    FormField,
  },
  props: {
    fill: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  directives: { mask },
  data: () => ({
    payload: {
      id: {
        type: null,
        number: null,
      },
    },
    IdEnums: [
      "Driver's License",
      "GSIS",
      "National ID",
      "Passport",
      "PRC",
      "SSS",
      "Voter's ID",
    ],
  }),
  methods: {
    emitTransaction() {
      this.$emit("emit-transaction", this.payload);
    },

    idNumberMask(idType) {
      const masks = {
        "National ID": "####-####-####-####",
        "Driver's License": "X##-##-######",
        Passport: "AX######X",
        SSS: "##-########",
        GSIS: "###########",
        PRC: "#######",
        "Voter's ID": "XX##-####A-A####AAA#####-#",
      };
      return masks[idType] ?? "";
    },

    idNumberPlaceholder(idType) {
      const placeholders = {
        "National ID": "1111-2222-3333-4444",
        "Driver's License": "D01-02-123456",
        Passport: "P1234567A",
        SSS: "12-34567890",
        GSIS: "12345678901",
        PRC: "1234567",
        "Voter's ID": "7501-0068B-C1451BCD",
      };
      return placeholders[idType] ?? "";
    },

    idInputLengthRules(idType) {
      let placeholderLength = this.idNumberPlaceholder(idType)?.length;
      let minCharacterCount = placeholderLength;

      switch (idType) {
        case "National ID":
          minCharacterCount = 16;
          break;
        case "Driver's License":
          minCharacterCount = 11;
          break;
        case "Passport":
          placeholderLength = 7;
          minCharacterCount = 7;
          break;
        case "SSS":
          minCharacterCount = 10;
          break;
        case "Voter's ID":
          minCharacterCount = 16;
          break;
      }

      const rule = {
        requiredLength: placeholderLength,
        errorMessage: `Min ${minCharacterCount} characters`,
      };

      return rule;
    },

    handleTypeChange() {
      this.payload.id.number = "";
      this.$refs.idNumberInput.$refs.input.value = "";
      this.emitTransaction();
    },
  },
  computed: {
    rules: function () {
      if (this.readonly) return { type: [], IdNumber: [] };

      const errors = {};
      errors.type = [(v) => !!v || "Id type is required"];
      errors.IdNumber = [(v) => !!v || "Id number is required"];

      if (this.payload.id.type) {
        const { requiredLength, errorMessage } = this.idInputLengthRules(
          this.payload.id.type
        );
        errors.IdNumber.push(
          (v) => v?.length >= requiredLength || errorMessage
        );
      }

      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.id) {
          this.payload.id = {
            type: newVal.id.type,
            number: newVal.id.number,
          };
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.id = {
            type: null,
            number: null,
          };
        }
      },
    },
  },
};
</script>

<style scoped></style>
