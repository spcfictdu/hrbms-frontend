<template>
  <v-container class="pa-0">
    <div
      class="w-full d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <p class="text-md-h5 text-h6 font-weight-bold mb-2 mb-sm-1">
        {{ $route.meta.name }}
      </p>
      <!-- <div class="red--text">{{ $route.meta }}</div>
      <div class="yellow--text">{{ $router.currentRoute.meta }}</div> -->
      <div class="w-full d-none d-sm-flex flex-row align-center justify-center">
        <!-- Nav Controls -->
        <v-btn
          :small="$vuetify.breakpoint.mdAndDown"
          :plain="route.name !== activeRouteButton"
          :text="route.name === activeRouteButton"
          elevation="0"
          v-for="(route, index) in routes"
          :key="'route' + index"
          @click="redirect(route)"
          :ripple="false"
          :color="route.name !== 'Log Out' ? '' : 'warning'"
          >{{ route.name.toUpperCase() }}
        </v-btn>
      </div>

      <!-- Mobile breakpoint -->
      <div
        class="w-full d-flex d-sm-none flex-row align-center justify-center mb-2"
      >
        <v-btn
          x-small
          :plain="route.name !== activeRouteButton"
          :text="route.name === activeRouteButton"
          elevation="0"
          :ripple="false"
          v-for="(route, index) in routes"
          :key="'route' + index"
          @click="redirect(route)"
          :color="route.name !== 'Log Out' ? '' : 'warning'"
          >{{ route.name.toUpperCase() }}
        </v-btn>
      </div>
    </div>

    <v-divider />

    <div v-if="$router.currentRoute.meta?.withSearchEngine">
      <!-- Search Engine -->
      <div class="my-6">
        <SearchEngine ref="searchEngine" @queryParams="submitQuery" />
      </div>

      <v-divider />
    </div>
  </v-container>
</template>

<script>
import SearchEngine from "@/components/public/SearchEngine.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
import { mapActions } from "vuex";
import { auth } from "@/utils/auth";

export default {
  name: "PublicHeader",
  mixins: [assignParams],
  components: { SearchEngine },
  data: () => ({
    activeButton: null,
  }),
  methods: {
    ...mapActions("authentication", ["logout"]),
    redirect: function (route) {
      this.activeButton = route.name;

      if (route.route?.route) {
        return this.$router.push({ name: route.route.route }).catch((err) => {
          if (err.name !== "NavigationDuplicated") {
            throw err;
          }
        });
      } else if (route.route) {
        return this.$router.push({ name: route.route }).catch((err) => {
          if (err.name !== "NavigationDuplicated") {
            throw err;
          }
        });
      } else {
        return route.action();
      }
    },
    submitQuery: function (queryParams) {
      this.assignParams(queryParams);

      this.$router.push({ query: this.queryParams }).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    },
    routeSearchQueryHandler(newVal) {
      if (this.$refs.searchEngine) {
        if (newVal) {
          this.$refs.searchEngine.resetQuery();
        } else {
          this.$refs.searchEngine.setQuery();
        }
      }
    },
  },
  computed: {
    activeRouteButton: function () {
      return this.activeButton;
    },
    routes: function () {
      let routes = [];
      if (
        this.$route.name === "Public Dashboard" &&
        this.$route.meta.isPublic
      ) {
        if (JSON.stringify(this.$route.query) === "{}") {
          routes.push({
            name: "Sign In",
            route: "Guest Sign In",
          });
        } else {
          routes.push(
            {
              name: "Home",
              route: "Public Dashboard",
            },
            {
              name: "Create Account",
              route: "Guest Sign In",
            }
          );
        }
      } else if (this.$route.meta.isPublic) {
        routes.push(
          {
            name: "Home",
            route: "Public Dashboard",
          },
          {
            name: "Create Account",
            route: "Guest Sign In",
          }
        );
      } else if (this.$auth.user().role === "GUEST") {
        routes.push(
          {
            name: "Hotel Rooms",
            route: "Guest Dashboard",
          },
          {
            name: "Account",
            route: "Guest Account Details",
          },
          {
            name: "Log Out",
            action: () => {
              this.logout(auth.user().role);
            },
          }
        );
      }
      return routes;
    },
    routeSearchQuery: function () {
      return JSON.stringify(this.$route.query) === "{}";
    },
  },
  watch: {
    routeSearchQuery: {
      immediate: true,
      handler: function (newVal) {
        this.routeSearchQueryHandler(newVal);
      },
    },
  },
  beforeUpdate() {
    this.$nextTick(() => {
      if (this.$refs.searchEngine) {
        this.routeSearchQueryHandler(this.routeSearchQuery);
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    if (Object.keys(to.query).length > 0) {
      next({ path: to.path, query: {} });
    } else {
      next();
    }
  },
};
</script>

<style scoped></style>
