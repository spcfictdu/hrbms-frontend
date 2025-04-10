<template>
  <div>
    <v-card flat class="sign-in-card ma-auto">
      <v-avatar size="128" class="mt-n16 fcpc-logo">
        <v-img src="../../assets/FCPCLogo2.jpg" />
      </v-avatar>
      <v-card-title class="text-subtitle-1 text-sm-h5">{{
        schoolName
      }}</v-card-title>
      <v-card-subtitle class="text-subtitle-1 mt-2 font-weight-bold"
        >SIGN IN</v-card-subtitle
      >

      <v-alert :value="showAlert" type="error" class="w-full">
        {{ alertMeta.message }}
      </v-alert>

      <v-form ref="form" @submit.prevent="handleAuth">
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
    loginRole: "ADMIN",
    showAlert: false,
    loading: false,
  }),

  computed: {
    ...mapState("authentication", ["currentUser"]),
    ...mapState("alerts", ["alertMeta"]),
  },
  methods: {
    ...mapActions("authentication", ["login"]),
    handleAuth: async function () {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      try {
        await this.login({
          user: this.user,
          loginRole: this.loginRole,
        });
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
.sign-in-card {
  max-width: 400px;
  margin-bottom: 10rem;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}

.fcpc-logo {
  border: 5px solid white;
}
</style>
