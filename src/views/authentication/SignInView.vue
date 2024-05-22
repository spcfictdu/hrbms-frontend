<template>
  <div>
    <v-card elevation="0" class="sign-in-card mx-auto">
      <v-avatar size="128" class="mt-n16 fcpc-logo">
        <v-img src="../../assets/FCPCLogo2.jpg" />
      </v-avatar>
      <v-card-title class="text-subtitle-1 text-sm-h5">{{
        schoolName
      }}</v-card-title>
      <v-card-subtitle class="text-subtitle-1 mt-2 font-weight-bold"
        >SIGN IN</v-card-subtitle
      >

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
        <v-text-field v-model="user.username" outlined label="Username" />
        <v-text-field
          v-model="user.password"
          type="password"
          outlined
          label="Password"
        />

        <v-btn
          block
          color="primary"
          elevation="0"
          :loading="loading"
          type="submit"
        >
          SIGN IN
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "SignInView",
  data: () => ({
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
  },

  methods: {
    ...mapActions("authentication", ["login"]),

    authenticateUser: async function () {
      if (this.$refs.form.validate()) {
        this.loading = true;
        await this.login(this.user);
        this.loading = false;
      }
    },

    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
  },

  watch: {
    loginStatus: {
      deep: true,
      handler: function (newVal) {
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
  max-width: 400px;
  margin-bottom: 10rem;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fcpc-logo {
  border: 5px solid white;
}

.text-fields-container {
  width: 100%;
  margin-bottom: 2rem;
}

.alert-container {
  width: 100%;
}
</style>
