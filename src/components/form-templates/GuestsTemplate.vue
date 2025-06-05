<template>
  <FormSection title="Guests">
    <FormField label="Extra Person">
      <v-select
        hide-details="auto"
        v-model="payload.guests"
        dense
        outlined
        @change="emitTransaction"
        :items="guestsEnums"
      ></v-select>
    </FormField>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
import TitleSlot from "../slots/TitleSlot.vue";
export default {
  name: "GuestsTemplate",
  components: {
    TitleSlot,
    FormSection,
    FormField,
  },
  props: {
    guestsEnums: Array,
    fill: Object,
  },
  data: () => ({
    payload: {
      guests: 0,
    },
  }),
  methods: {
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },
  },
  mounted() {
    this.emitTransaction();
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (typeof newVal?.extraPerson === "number") {
          this.payload.guests = newVal.extraPerson;
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.guests = 0;
        }
      },
    },
  },
};
</script>

<style scoped></style>
