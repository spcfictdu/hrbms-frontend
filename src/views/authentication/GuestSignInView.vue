<template>
  <div>
    <v-card elevation="0" class="sign-in-card ma-auto transition-fast-in-fast-out">
      <div class="sign-in-container">
        <v-avatar size="128" class="mt-n16 fcpc-logo">
          <v-img src="../../assets/FCPCLogo2.jpg" />
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
        <v-slide-x-transition mode="out-in">
          <div v-if="!isRegister" key="login">
            <div class="pb-4">
              <label-slot>
                <template #label> Email </template>
              </label-slot>
              <v-text-field
                type="email"
                v-model="user.username"
                outlined
                dense
                rounded
                hide-details="auto"
              />
            </div>

            <div class="pb-4">
              <label-slot>
                <template #label> Password </template>
              </label-slot>
              <v-text-field
                v-model="user.password"
                type="password"
                outlined
                dense
                rounded
                hide-details="auto"
              />
            </div>
          </div>
        </v-slide-x-transition>

        <v-slide-x-reverse-transition mode="out-in">
          <register-form v-if="isRegister" key="register" />
        </v-slide-x-reverse-transition>

        <v-btn
          class="mt-4"
          block
          color="primary"
          depressed
          rounded
          :loading="loading"
          type="submit"
        >
          LOG IN
        </v-btn>

        <p class="mt-4 mb-0 text-caption text-center">
          {{ accountStatusText.text }}?
          <span class="primary--text font-weight-bold" @click="showRegister">{{
            accountStatusText.buttonText
          }}</span>
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
    isShowAlert: false,
    loading: false,
  }),

  computed: {
    ...mapState("authentication", {
      loginStatus: (state) => state.loginStatus,
      currentUser: (state) => state.currentUser,
    }),
    accountStatusText() {
      return this.isRegister
        ? { text: "Already have an account", buttonText: "Sign In" }
        : { text: "Don't have an account", buttonText: "Register" };
    },
  },

  methods: {
    ...mapActions("authentication", ["login"]),

    async authenticateUser() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        await this.login(this.user);
        this.loading = false;
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
</style>
