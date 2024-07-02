<template>
  <div>
    <v-card elevation="0" class="sign-in-card ma-auto">
      <div class="sign-in-container">
        <v-avatar size="128" class="mt-n16 fcpc-logo">
          <v-img src="../../assets/FCPCLogo2.jpg"/>
        </v-avatar>
        <v-card-title class="sign-in-title">{{ schoolName }}</v-card-title>
        <v-card-subtitle class="text-caption font-weight-regular white--text">
          SIGN IN
        </v-card-subtitle>
      </div>

      <div class="alert-container">
        <v-alert v-if="isShowAlert" type="error" class="w-full">
          {{ loginStatus.message ?? loginStatus.message }}
        </v-alert>
      </div>

      <v-form
          ref="form"
          class="text-fields-container"
          @submit.prevent="authenticateUser"
      >
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
              />
            </div>

            <div class="pb-4">
              <label-slot>
                <template #label> Password</template>
              </label-slot>
              <v-text-field
                  v-model="user.password"
                  type="password"
                  outlined
                  dense
                  rounded
                  hide-details="auto"
                  :rules="rules.password"
              />
            </div>
          </div>
          <div v-else key="register">
            <register-form @register-data="assignPayload"/>
          </div>
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
          </span
          >
        </p>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LabelSlot from "../../components/slots/LabelSlot.vue";
import RegisterForm from "@/components/form-templates/login/RegisterForm.vue";

export default {
  name: "GuestSignInView",
  components: { LabelSlot, RegisterForm },
  data: () => ({
    isRegister: false,
    schoolName: "First City Providential College",
    user: {
      username: null,
      password: null,
    },
    payload: {
      role: "GUEST",
    },
    loginRole: "GUEST",
    isShowAlert: false,
    loading: false,
  }),

  computed: {
    ...mapState("authentication", {
      loginStatus: (state) => state.loginStatus,
      currentUser: (state) => state.currentUser,
    }),
    accountStatusText: function () {
      return this.isRegister
          ? { text: "Already have an account", buttonText: "Register", anchorText: "Sign In" }
          : { text: "Don't have an account", buttonText: "Log In", anchorText: "Register" };
    },
    rules: function () {
      let errors = {};
      errors.username = [(v) => !!v || "Username is required"];
      errors.password = [(v) => !!v || "Password is required"];
      return errors;
    }
  },

  methods: {
    ...mapActions("authentication", ["login", "register"]),
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    async authenticateUser() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        if (this.isRegister) {
          await this.register(this.payload).finally(() => {
            this.loading = false;
          });
        } else {
          await this.login({
            user: this.user,
            loginRole: this.loginRole,
          }).finally(() => {
            this.loading = false;
          });
        }
      }
    },

    triggerAlert(value) {
      this.isShowAlert = value;
    },

    showRegister() {
      this.isRegister = !this.isRegister;
    },
  },

  watch: {
    loginStatus: {
      deep: true,
      handler(newVal) {
        //Opens the error alert message when the login fails
        if (newVal.status.toLowerCase() === "error") {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped>
.sign-in-card {
  opacity: 0.98;
  max-width: 400px;
  margin-bottom: 10rem;
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.text-fields-container {
  width: 100%;
}

.alert-container {
  width: 100%;
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
