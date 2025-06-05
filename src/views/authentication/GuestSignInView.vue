<template>
  <div class="route-container">
    <v-card flat class="sign-in-card ma-auto">
      <div class="sign-in-container">
        <v-avatar size="128" class="mt-n16 fcpc-logo">
          <v-img :src="institution.logo" />
        </v-avatar>
        <v-card-title class="sign-in-title">{{
          institution.name
        }}</v-card-title>
        <v-card-subtitle class="text-caption font-weight-regular white--text">
          SIGN IN
        </v-card-subtitle>
      </div>

      <v-alert :value="showAlert" type="error" class="w-full">
        {{ alertMeta.message }}
      </v-alert>

      <v-form ref="form" @submit.prevent="handleAuth">
        <transition name="fade" mode="out-in">
          <div v-if="!isRegister" key="login">
            <div class="pb-4">
              <label-slot>
                <template #label> Email</template>
              </label-slot>
              <v-text-field
                type="email"
                v-model="user.username"
                outlined
                dense
                rounded
                hide-details="auto"
                :rules="rules.username"
                autocomplete="username"
              />
            </div>

            <div class="pb-4">
              <label-slot>
                <template #label> Password</template>
              </label-slot>
              <v-text-field
                v-model="user.password"
                outlined
                dense
                rounded
                hide-details="auto"
                :rules="rules.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
              />
            </div>
          </div>

          <register-form v-else key="register" @register-data="assignPayload" />
        </transition>

        <v-btn
          class="mt-4"
          block
          color="primary"
          depressed
          rounded
          :loading="loading"
          type="submit"
        >
          {{ accountStatusText.buttonText }}
        </v-btn>

        <p class="mt-4 mb-0 text-caption text-center">
          {{ accountStatusText.text }}?
          <span
            style="cursor: pointer"
            @click="showRegister"
            class="primary--text font-weight-bold"
            >{{ accountStatusText.anchorText }}
          </span>
        </p>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import RegisterForm from "@/components/form-templates/login/RegisterForm.vue";
export default {
  name: "GuestSignInView",
  components: { RegisterForm },
  props: {
    method: String,
  },
  data: () => ({
    institution: {
      name: "Systems Plus College Foundation",
      acronym: "SPCF",
      logo: require("@/assets/logos/SPCFLogo.png"),
    },

    // Meta
    showPassword: false,
    isRegister: false,

    // User credentials
    user: {
      username: null,
      password: null,
    },
    payload: {
      role: "GUEST",
    },
    loginRole: "GUEST",

    // Buttons and Alerts
    showAlert: false,
    loading: false,
  }),
  methods: {
    ...mapActions("authentication", ["login", "register"]),
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    handleAuth: async function () {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      try {
        if (this.isRegister) {
          await this.register(this.payload);
        } else {
          await this.login({
            user: this.user,
            loginRole: this.loginRole,
          });
        }
      } finally {
        this.loading = false;
      }
    },
    showRegister() {
      this.isRegister = !this.isRegister;
    },
  },
  computed: {
    ...mapState("authentication", ["currentUser"]),
    ...mapState("alerts", ["alertMeta"]),
    accountStatusText: function () {
      return this.isRegister
        ? {
            text: "Already have an account",
            buttonText: "Register",
            anchorText: "Sign In",
          }
        : {
            text: "Don't have an account",
            buttonText: "Log In",
            anchorText: "Register",
          };
    },
    rules: function () {
      let errors = {};
      errors.username = [(v) => !!v || "Username is required"];
      errors.password = [(v) => !!v || "Password is required"];
      return errors;
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
    method: {
      immediate: true,
      handler: function (v) {
        if (v === "register") this.isRegister = true;
      },
    },
  },
};
</script>

<style scoped>
.route-container {
  padding: 0;
}

/* Height Breakpoint */
@media (max-height: 900px) {
  .route-container {
    padding: 80px 0;
  }
}

.sign-in-card {
  opacity: 0.98;
  max-width: 400px;
  margin-bottom: 10rem;
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}

.sign-in-container {
  width: 100%;
  max-height: 150px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url(../../assets/bgImage-3.png) no-repeat center/cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2rem;
  border-radius: 10px;
}

.sign-in-container .sign-in-title {
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.7px;
}

.fcpc-logo {
  border: 5px solid white;
}

/* Ensure form-wrapper transitions height smoothly */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, height 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  height: auto; /* Ensures proper transition */
}
</style>
