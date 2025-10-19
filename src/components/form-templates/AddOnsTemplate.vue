<template>
  <FormSection title="Add-Ons">
    <AmenityField
      :value="fill?.addons"
      @onInput="(v) => handleAmenityChange(v)"
      :readonly="readonly"
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
    readonly: {
      type: Boolean,
      default: false,
    },
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
    handleAmenityChange(v) {
      this.payload.addons = v.map((addon) => ({
        name: addon.name,
        quantity: String(addon.quantity),
        ...(addon.folio && { folio: addon.folio }),
      }));
      this.$emit("emit-transaction", this.payload);
    },
  },
};
</script>

<style scoped></style>
