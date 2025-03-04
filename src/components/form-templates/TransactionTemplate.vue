<template>
  <FormSection title="Transaction">
    <FormField label="Status">
      <v-select
        outlined
        dense
        :items="statuses"
        v-model="payload.status"
        hide-details="auto"
        @change="emitTransaction"
        item-text="status"
        item-value="value"
        clearable
        :rules="rules.status"
        required
      />
    </FormField>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "TransactionTemplate",
  components: {
    FormField,
    FormSection,
  },
  props: {
    statuses: Array,
    fill: Object,
  },
  data: () => ({
    payload: {
      status: null,
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
      errors.status = [(v) => !!v || "Status is required"];
      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.status) {
          this.payload.status = newVal.status;
          this.$emit("emit-transaction", this.payload);
        }
      },
    },
  },
};
</script>

<style scoped></style>
