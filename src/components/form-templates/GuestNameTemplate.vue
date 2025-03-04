<template>
  <FormSection title="Guest Name">
    <FormField label="First Name">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.firstName"
        v-model="payload.firstName"
        @change="emitTransaction"
      ></v-text-field>
    </FormField>

    <FormField label="Middle Name" class="my-4">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        v-model="payload.middleName"
        @change="emitTransaction"
      ></v-text-field>
    </FormField>

    <FormField label="Last Name">
      <v-text-field
        dense
        hide-details="auto"
        outlined
        :rules="rules.lastName"
        v-model="payload.lastName"
        @change="emitTransaction"
      ></v-text-field>
    </FormField>
  </FormSection>
</template>

<script>
import FormField from "../fields/FormField.vue";
import FormSection from "../sections/FormSection.vue";
export default {
  name: "GuestNameTemplate",
  components: {
    FormField,
    FormSection,
  },
  props: {
    fill: Object,
  },
  data: () => ({
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
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
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.lastName = [(v) => !!v || "Last name is required"];
      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload = {
            firstName: newVal.first_name,
            middleName: newVal.middle_name,
            lastName: newVal.last_name,
          };
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload = {
            firstName: null,
            middleName: null,
            lastName: null,
          };
        }
      },
    },
  },
};
</script>

<style scoped></style>
