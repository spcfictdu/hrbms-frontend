<template>
  <div>
    <div class="pb-4">
      <label-slot>
        <template #label> First Name</template>
      </label-slot>
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
      <label-slot>
        <template #label> Middle Name</template>
      </label-slot>
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
      <label-slot>
        <template #label> Last Name</template>
      </label-slot>
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
      <label-slot>
        <template #label> Mobile Number</template>
      </label-slot>
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
      <label-slot>
        <template #label> Email</template>
      </label-slot>
      <v-text-field
          type="email"
          v-model="payload.email"
          outlined
          dense
          rounded
          hide-details="auto"
          @change="emitTransaction"
          :rules="rules.email"
      />
    </div>

    <div class="pb-4">
      <label-slot>
        <template #label> Password</template>
      </label-slot>
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
      />
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import LabelSlot from '@/components/slots/LabelSlot.vue';

export default {
  name: "RegisterForm",
  components: { LabelSlot },
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
    }
  }),
  methods: {
    emitTransaction: function () {
      this.$emit("register-data", this.payload);
    }
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.middleName = [];
      errors.lastName = [(v) => !!v || "Last name is required"];
      errors.mobileNumber = [(v) => !!v || "Mobile number is required"];
      errors.email = [(v) => !!v || "email is required"];
      errors.password = [(v) => !!v || "Password is required"];
      return errors;
    }
  }
};
</script>

<style scoped></style>
