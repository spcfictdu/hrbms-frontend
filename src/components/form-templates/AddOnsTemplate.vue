<template>
  <FormSection title="Add-Ons">
    <AmenityField
      :value="fill?.addons"
      @onInput="(v) => handleAmenityChange(v)"
      :readonly="readonly"
      :guestName="guestName"
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
    guestName: String,
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
      addons: [],
    },
  }),
  methods: {
    handleAmenityChange(v) {
      this.payload.addons = v.map((addon) => ({
        ...addon,
        quantity: String(addon.quantity),
      }));
      this.$emit("emit-transaction", this.payload);
    },
  },
};
</script>

<style scoped></style>
