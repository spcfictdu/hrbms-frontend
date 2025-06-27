<template>
  <FormSection title="Add-Ons">
    <AmenityField
      :value="fill?.addons"
      @onInput="(v) => handleAmenityChange(v)"
    />
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
import AmenityField from "../fields/AmenityField.vue";
export default {
  name: "AddOnsTemplate",
  props: {
    fill: Object,
  },
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
      this.payload.addons = v.map(({ name, quantity }) => ({
        name,
        quantity: String(quantity),
      }));
      this.$emit("emit-transaction", this.payload);
    },
  },
};
</script>

<style scoped></style>
