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
  },
  directives: { mask },
  data: () => ({
    payload: {
      id: {
        type: null,
        number: null,
      },
    },
    IdEnums: ["National ID", "Driver's License", "Passport"],
  }),
  methods: {
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },

    idNumberMask(idType) {
      const mask = {
        "National ID": "####-####-####-####",
        "Driver's License": "X##-##-######",
        Passport: "AX######X",
      };
      return mask[idType] ?? "";
    },

    handleTypeChange() {
      this.payload.id.number = "";
      this.$refs.idNumberInput.$refs.input.value = "";
      this.emitTransaction();
    },
  },
  computed: {
    rules: function () {
      const errors = {};
      errors.type = [(v) => !!v || "Id type is required"];
      errors.IdNumber = [(v) => !!v || "Id number is required"];
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
