<template>
  <FormSection title="Address">
    <FormField label="Province">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.province"
        v-model="payload.address.province"
        @change="emitTransaction"
      ></v-text-field>
    </FormField>

    <FormField label="City/Municipality" class="mt-4">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.city"
        v-model="payload.address.city"
        @change="emitTransaction"
      ></v-text-field>
    </FormField>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "AddressTemplate",
  components: {
    FormSection,
    FormField,
  },
  props: {
    fill: Object,
  },
  data: () => ({
    payload: {
      address: {
        province: null,
        city: null,
      },
    },
  }),

  methods: {
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },
  },
  computed: {
    rules: function () {
      const errors = {};
      errors.province = [(v) => !!v || "Province is required"];
      errors.city = [(v) => !!v || "City/Municipality is required"];
      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload.address = {
            province: newVal.province,
            city: newVal.city,
          };
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.address = {
            province: null,
            city: null,
          };
        }
      },
    },
  },
};
</script>

<style scoped></style>
