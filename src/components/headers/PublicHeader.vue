<template>
  <v-container class="pa-0">
    <div
      class="w-full d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <p class="text-md-h5 text-h6 font-weight-bold mb-2 mb-sm-1">
        {{ $route.meta.name }}
      </p>
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
          v-for="(route, index) in routes"
          :key="'route' + index"
          @click="redirect(route)"
          >{{ route.name.toUpperCase() }}
        </v-btn>
      </div>
    </div>

    <v-divider />

    <!-- Search Engine -->
    <div class="my-6">
      <SearchEngine @queryParams="submitQuery" />
    </div>

    <v-divider />
  </v-container>
</template>

<script>
import SearchEngine from "@/components/public/SearchEngine.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "PublicHeader",
  mixins: [assignParams],
  components: { SearchEngine },
  data: () => ({
    activeButton: null,
  }),
  methods: {
    redirect: function (route) {
      this.activeButton = route.name;

      if (route.route?.route) {
        return this.$router.push({ name: route.route.route });
      } else if (route.route) {
        return this.$router.push({ name: route.route });
      } else {
        return route.action();
      }
    },
    submitQuery: function (queryParams) {
      console.log(queryParams);
      this.assignParams(queryParams);

      return this.$router.push({ query: this.queryParams });
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
      } else if (this.$route.meta.isGuest) {
        routes.push(
          {
            name: "Hotel Rooms",
            route: "",
          },
          {
            name: "Account",
            route: "",
          }
        );
      }
      return routes;
    },
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
