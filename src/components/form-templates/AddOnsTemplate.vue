<template>
  <FormSection title="Add-Ons">
    <AmenityField @onInput="(v) => handleAmenityChange(v)" />
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
import AmenityField from "../fields/AmenityField.vue";
export default {
  name: "AddOnsTemplate",
  components: {
    FormSection,
    FormField,
    AmenityField,
  },
  data: () => ({
    payload: {
      addons: null,
    },
  }),
  methods: {
    handleAmenityChange: function (v) {
      this.payload.addons = v;
      this.$emit("emit-transaction", this.payload);
    },
  },
};
</script>

<style scoped></style>
