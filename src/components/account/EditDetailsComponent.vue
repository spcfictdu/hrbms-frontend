<template>
  <div>
    <!-- Alert -->
    <v-alert
      :value="alert"
      :type="alertType"
      dense
      class="w-full mt-2"
      transition="scroll-y-transition"
    >
      {{ alertMeta.message ?? alertMeta.message }}
    </v-alert>

    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <FormField label="First Name">
            <v-text-field
              background-color="white"
              dense
              outlined
              hide-details="auto"
              v-model="payload.firstName"
              :rules="rules.firstName"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <FormField label="Middle Name">
            <v-text-field
              background-color="white"
              dense
              outlined
              hide-details="auto"
              v-model="payload.middleName"
              :rules="rules.middleName"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <FormField label="Last Name">
            <v-text-field
              background-color="white"
              dense
              outlined
              hide-details="auto"
              v-model="payload.lastName"
              :rules="rules.lastName"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <FormField label="Email">
            <v-text-field
              background-color="white"
              type="email"
              dense
              outlined
              hide-details="auto"
              v-model="payload.email"
              :rules="rules.email"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <FormField label="Phone">
            <v-text-field
              background-color="white"
              counter="11"
              maxLength="11"
              type="tel"
              dense
              outlined
              hide-details="auto"
              v-mask="'###########'"
              v-model="payload.phoneNumber"
              :rules="rules.phoneNumber"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <FormField label="Province">
            <v-text-field
              background-color="white"
              dense
              outlined
              hide-details="auto"
              v-model="payload.province"
              :rules="rules.province"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <FormField label="City">
            <v-text-field
              background-color="white"
              dense
              outlined
              hide-details="auto"
              v-model="payload.city"
              :rules="rules.city"
            ></v-text-field>
          </FormField>
        </v-col>
      </v-row>
    </v-form>
    <div
      class="mt-4 d-flex flex-column-reverse flex-sm-row justify-center justify-sm-end align-center"
    >
      <v-btn
        class="mr-0 mr-sm-4 mt-4 mt-sm-0"
        :block="$vuetify.breakpoint.xs"
        outlined
        color="primary"
        @click="handleCancelEvent"
        >Cancel
      </v-btn>
      <v-btn
        color="primary"
        :block="$vuetify.breakpoint.xs"
        @click="handleAccountUpdate"
        :loading="loading"
        >Save Changes</v-btn
      >
    </div>
  </div>
</template>

<script>
import FormField from "../fields/FormField.vue";
import { mask } from "vue-the-mask";
export default {
  name: "EditDetailsComponent",
  directives: { mask },
  components: { FormField },
  props: { accountData: Object, alertMeta: Object, loading: Boolean },
  data: () => ({
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      province: null,
      city: null,
    },
  }),
  methods: {
    handleAccountUpdate: function () {
      if (this.$refs.form.validate()) {
        this.$emit("update-event", this.payload);
      }
    },
    handleCancelEvent: function () {
      this.$emit("cancel-event");
    },
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.middleName = [];
      errors.lastName = [(v) => !!v || "Last name is required"];
      errors.email = [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ];
      errors.phoneNumber = [(v) => !!v || "Phone number is required"];
      errors.province = [];
      errors.city = [];
      return errors;
    },
    alert: function () {
      return this.alertMeta.status === "error" ? true : false;
    },
    alertType: function () {
      return "error";
    },
  },
  watch: {
    accountData: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.payload = {
            firstName: newVal.firstName,
            middleName: newVal.middleName,
            lastName: newVal.lastName,
            email: newVal.email,
            phoneNumber: newVal.phone,
            province: newVal.address.province,
            city: newVal.address.city,
          };
        }
      },
    },
  },
};
</script>

<style scoped></style>
