<template>
  <v-app class="bg-color" :class="bgImages[$router.currentRoute.meta.name]">
    <PageLoader :target="hasLoaded">
      <div class="container-height">
        <!-- Navigation -->
        <Navigation v-if="navigation.primary" />
        <PublicNavigation v-if="navigation.secondary" />

        <div
          :class="{
            'flex-grow-1 mt-n10 bg-color main-layout white py-5':
              !notAllowedRoutes.includes($router.currentRoute.name),
          }"
        >
          <v-container class="pa-0 transparent-bg">
            <v-main
              class="mx-3"
              :class="{
                'custom-main': notAllowedRoutes.includes(
                  $router.currentRoute.name
                ),
              }"
            >
              <router-view />
              <AlertComponent />
            </v-main>
          </v-container>
        </div>
        <!-- Footer Component -->
        <footer-component
          v-if="allowedFooterRoutes.includes($router.currentRoute.name)"
        />
      </div>
    </PageLoader>
  </v-app>
</template>

<script>
import Navigation from "./components/navigation/Navigation.vue";
import { mapActions } from "vuex";
import PublicNavigation from "./components/navigation/PublicNavigation.vue";
import FooterComponent from "./components/public/FooterComponent.vue";
import PageLoader from "./components/loaders/PageLoader.vue";
import AlertComponent from "./components/alerts/AlertComponent.vue";
export default {
  name: "App",
  components: {
    Navigation,
    PublicNavigation,
    FooterComponent,
    PageLoader,
    AlertComponent,
  },
  data: () => ({
    hasLoaded: false,
    notAllowedRoutes: ["Sign In", "Guest Sign In"],
    allowedFooterRoutes: ["Public Dashboard", "Guest Dashboard"],
    bgImages: {
      "Sign In": "image-bg",
      "Guest Sign In": "image-bg-2",
    },
  }),
  methods: {
    ...mapActions("authentication", ["logout"]),
  },
  computed: {
    navigation: function () {
      const currentRoute = this.$route.meta;
      return {
        primary:
          this.$auth.user()?.role === "ADMIN" &&
          !(currentRoute["isPublic"] || currentRoute["isGuest"]),
        secondary: currentRoute["isPublic"] || currentRoute["isGuest"],
      };
    },
  },
  mounted() {
    // if (
    //   !this.$auth.user() &&
    //   !this.notAllowedRoutes.includes(this.$router.currentRoute.name)
    // ) {
    //   // this.logout();
    // }
    setTimeout(() => {
      this.hasLoaded = true;
    }, 1000);
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

.container-height {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
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
  min-height: 100dvh;
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
