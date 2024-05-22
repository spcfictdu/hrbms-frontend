<template>
  <v-app
    class="bg-color"
    :class="{ 'image-bg': $router.currentRoute.meta.name === 'Sign In' }"
  >
    <div>
      <Navigation v-if="$router.currentRoute.meta.name !== 'Sign In'" />
      <div
        :class="{
          'mt-n10 bg-color main-layout white py-5':
            $router.currentRoute.meta.name !== 'Sign In',
        }"
      >
        <v-container class="pa-0 transparent-bg">
          <v-main
            class="mx-3"
            :class="{
              'custom-main': $router.currentRoute.meta.name === 'Sign In',
            }"
          >
            <router-view />
          </v-main>
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
import Navigation from "./components/navigation/Navigation.vue";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: { Navigation },
  data: () => ({
    //
  }),

  methods: {
    ...mapActions("authentication", ["logout"]),
  },

  mounted() {
    if (!this.$auth.user() && (this.$router.currentRoute.name !== "Sign In")) {
      this.logout();
    }
  },
};
</script>

<style scoped>
.main-layout {
  border-radius: 40px 40px 0 0;
}

.bg-color {
  background-color: #f9f6ff !important;
}

.transparent-bg {
  background-color: transparent !important;
}

.image-bg {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url(./assets/bgImage.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.custom-main {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
</style>
