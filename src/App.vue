<template>
  <v-app
    class="bg-color"
    :class="{
      'image-bg': $router.currentRoute.meta.name === 'Sign In',
      'image-bg-2': $router.currentRoute.meta.name === 'Guest Sign In',
    }"
  >
    <div>
      <!-- Navigation -->
      <Navigation
        v-if="
          !$router.currentRoute.meta.isLogin &&
          !$router.currentRoute.meta.isPublic &&
          !$router.currentRoute.meta.isGuest
        "
      />
      <PublicNavigation v-else-if="$router.currentRoute.meta.isPublic || $router.currentRoute.meta.isGuest" />
      <div
        :class="{
          'mt-n10 bg-color main-layout white py-5': !notAllowedRoutes.includes(
            $router.currentRoute.meta.name
          ),
        }"
      >
        <v-container class="pa-0 transparent-bg">
          <v-main
            class="mx-3"
            :class="{
              'custom-main': notAllowedRoutes.includes(
                $router.currentRoute.meta.name
              ),
            }"
          >
            <router-view />
          </v-main>
        </v-container>
      </div>
      <!-- Footer Component -->
      <footer-component v-if="allowedFooterRoutes.includes($router.currentRoute.name)"/>
    </div>
  </v-app>
</template>

<script>
import Navigation from "./components/navigation/Navigation.vue";
import { mapActions } from "vuex";
import PublicNavigation from "./components/navigation/PublicNavigation.vue";
import FooterComponent from "./components/public/FooterComponent.vue";

export default {
  name: "App",
  components: { Navigation, PublicNavigation, FooterComponent },
  data: () => ({
    notAllowedRoutes: ["Sign In", "Guest Sign In"],
    allowedFooterRoutes: ["Public Dashboard", "Guest Dashboard"]
  }),

  methods: {
    ...mapActions("authentication", ["logout"]),
  },

  mounted() {
    // if (
    //   !this.$auth.user() &&
    //   !this.notAllowedRoutes.includes(this.$router.currentRoute.name)
    // ) {
    //   // this.logout();
    // }
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
    url(./assets/bgImage.jpg) no-repeat center center/cover;
}

.image-bg-2 {
  background: url(./assets/bgImage-2.jpg) no-repeat center/cover;
}

.custom-main {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.custom-main-2 {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4rem 0;
}
</style>
