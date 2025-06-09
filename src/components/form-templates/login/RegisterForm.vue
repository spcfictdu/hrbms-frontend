<template>
  <div>
    <div class="pb-4">
      <FormField>
        <template #label> First Name</template>
      </FormField>
      <v-text-field
        v-model="payload.firstName"
        outlined
        dense
        rounded
        hide-details="auto"
        @change="emitTransaction"
        :rules="rules.firstName"
      />
    </div>

    <div class="pb-4">
      <FormField>
        <template #label> Middle Name</template>
      </FormField>
      <v-text-field
        v-model="payload.middleName"
        outlined
        dense
        rounded
        hide-details="auto"
        @change="emitTransaction"
        :rules="rules.middleName"
      />
    </div>

    <div class="pb-4">
      <FormField>
        <template #label> Last Name</template>
      </FormField>
      <v-text-field
        v-model="payload.lastName"
        outlined
        dense
        rounded
        hide-details="auto"
        @change="emitTransaction"
        :rules="rules.lastName"
      />
    </div>

    <div class="pb-4">
      <FormField>
        <template #label> Mobile Number</template>
      </FormField>
      <v-text-field
        type="tel"
        v-model="payload.mobileNumber"
        outlined
        dense
        rounded
        hide-details="auto"
        @change="emitTransaction"
        :rules="rules.mobileNumber"
        maxLength="11"
        v-mask="'###########'"
      />
    </div>

    <div class="pb-4">
      <FormField>
        <template #label> Email</template>
      </FormField>
      <v-text-field
        type="email"
        v-model="payload.email"
        outlined
        dense
        rounded
        hide-details="auto"
        @change="emitTransaction"
        :rules="rules.email"
        autocomplete="username"
      />
    </div>

    <div class="pb-4">
      <FormField>
        <template #label> Password</template>
      </FormField>
      <v-text-field
        v-model="payload.password"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        rounded
        hide-details="auto"
        @change="emitTransaction"
        :rules="rules.password"
        @click:append="showPassword = !showPassword"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        autocomplete="new-password"
      />
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import FormField from "@/components/fields/FormField.vue";

export default {
  name: "RegisterForm",
  components: { FormField },
  directives: { mask },
  data: () => ({
    showPassword: false,
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
      mobileNumber: null,
      email: null,
      password: null,
    },
  }),
  methods: {
    emitTransaction: function () {
      this.$emit("register-data", this.payload);
    },
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.middleName = [];
      errors.lastName = [(v) => !!v || "Last name is required"];
      errors.mobileNumber = [
        (v) => !!v || "Mobile number is required",
        (v) => (v && v.length === 11) || "Mobile number has 11 characters",
      ];
      errors.email = [(v) => !!v || "Email is required"];
      errors.password = [(v) => !!v || "Password is required"];
      return errors;
    },
  },
};
</script>

<style scoped></style>
