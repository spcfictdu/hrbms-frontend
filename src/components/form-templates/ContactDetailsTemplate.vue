<template>
  <FormSection title="Contact Details">
    <v-row>
      <v-col cols="12" md="6">
        <FormField label="Phone Number">
          <v-text-field
            type="tel"
            dense
            hide-details="auto"
            outlined
            :rules="rules.phoneNumber"
            counter="11"
            v-model="payload.contact.phoneNumber"
            @change="emitTransaction"
          ></v-text-field>
        </FormField>
      </v-col>
      <v-col cols="12" md="6">
        <FormField label="Email">
          <v-text-field
            type="email"
            dense
            hide-details="auto"
            outlined
            :rules="rules.email"
            v-model="payload.contact.email"
            @change="emitTransaction"
          ></v-text-field>
        </FormField>
      </v-col>
    </v-row>
  </FormSection>
</template>

<script>
import FormField from "../fields/FormField.vue";
import FormSection from "../sections/FormSection.vue";
export default {
  name: "ContactDetailsTemplate",
  components: {
    FormSection,
    FormField,
  },
  props: {
    fill: Object,
  },
  data: () => ({
    payload: {
      contact: {
        phoneNumber: null,
        email: null,
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
      errors.phoneNumber = [
        (v) => !!v || "Phone number is required",
        (v) => (v && v.length === 11) || "Phone number has 11 characters",
      ];
      errors.email = [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ];
      return errors;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.phone_number && newVal?.email) {
          this.payload.contact = {
            phoneNumber: newVal.phone_number,
            email: newVal.email,
          };
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.contact.phoneNumber = null;
          this.payload.contact.email = null;
        }
      },
    },
  },
};
</script>

<style scoped></style>
