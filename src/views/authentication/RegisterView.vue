<template>
  <div>
    <v-card flat max-width="400" rounded="lg" class="pa-6 ma-auto">
      <div class="d-flex flex-column align-center">
        <v-avatar size="128" class="mt-n16 fcpc-logo">
          <v-img :src="institution.logo" />
        </v-avatar>
        <v-card-title
          :style="{ wordBreak: 'normal' }"
          class="text-subtitle-1 text-sm-h5 text-center"
        >
          {{ institution.name }}
        </v-card-title>
        <v-card-subtitle class="text-subtitle-1 mt-2 font-weight-bold">
          REGISTER
        </v-card-subtitle>
      </div>

      <v-alert :value="showAlert" type="error" class="w-full">
        {{ alertMeta.message }}
      </v-alert>

      <v-form v-model="valid" ref="form" @submit.prevent="handleAuth">
        <v-text-field
          v-model="user.username"
          :rules="[rules.required('Username')]"
          outlined
          label="Username"
        />
        <template v-if="isRegister">
          <v-text-field
            v-model="user.firstName"
            :rules="[rules.required('First Name')]"
            outlined
            label="First Name"
          />
          <v-text-field
            v-model="user.lastName"
            :rules="[rules.required('Last Name')]"
            outlined
            label="Last Name"
          />
          <v-text-field
            v-model="user.email"
            type="email"
            :rules="[rules.required('Email'), rules.email]"
            outlined
            label="Email"
          />
        </template>
        <v-text-field
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          v-model="user.password"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required('Password'), rules.password]"
          outlined
          label="Password"
          @click:append="showPassword = !showPassword"
        />

        <v-btn
          block
          color="primary"
          elevation="0"
          :loading="loading"
          :disabled="!valid"
          type="submit"
        >
          {{ submitBtnText }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "RegisterView",
  data: () => ({
    valid: true,
    institution: {
      name: "Systems Plus College Foundation",
      acronym: "SPCF",
      logo: require("@/assets/logos/SPCFLogo.png"),
    },
    showPassword: false,
    user: {
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      email: null,
    },
    rules: {
      required: (fieldName) => (value) =>
        !!value || `${fieldName} is required.`,
      password: (value) =>
        (value || "").length >= 8 || "Password must be at least 8 characters.",
      email: (value) => {
        const pattern = /.+@.+\..+/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
    showAlert: false,
    loading: false,
    isRegister: true,
  }),

  computed: {
    ...mapState("authentication", ["currentUser"]),
    ...mapState("alerts", ["alertMeta"]),

    submitBtnText() {
      return "REGISTER";
    },
  },
  methods: {
    ...mapActions("authentication", ["register"]),
    handleAuth: async function () {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      try {
        const response = await this.register({
          ...this.user,
          role: "FRONT DESK",
        });

        if (response && response.data.code === 201) {
          this.$refs.form.reset();
          this.user = {
            username: null,
            password: null,
            firstName: null,
            lastName: null,
            email: null,
          };
        }
      } finally {
        this.loading = false;
      }
    },
  },

  watch: {
    alertMeta: {
      deep: true,
      handler: function (v) {
        if (v.status === "error") {
          this.showAlert = true;
        } else {
          this.showAlert = false;
        }
      },
    },
  },
};
</script>

<style scoped>
/* .fcpc-logo {
  border: 5px solid white;
} */
</style>
