<template>
  <div class="primary pb-10 pt-md-5 pb-md-15">
    <v-container :class="{ 'xl-padding': $vuetify.breakpoint.xl }">
      <v-row no-gutters>
        <v-col
          cols="0"
          sm="0"
          md="3"
          xl="4"
          class="d-none d-md-flex justify-start"
        >
          <!-- Shows only on medium and up breakpoints -->
          <div
            class="white--text d-none d-md-flex align-center w-full justify-start"
          >
            <v-avatar size="40">
              <img :src="institution.logo" />
            </v-avatar>
            <div class="ml-2 d-none d-lg-flex flex-column">
              <p class="text-subtitle-2 pa-0 ma-0">{{ institution.acronym }}</p>
              <p class="text-caption pa-0 ma-0">{{ institution.name }}</p>
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="8"
          md="6"
          xl="4"
          offset-sm="2"
          offset-md="0"
          class="d-md-flex align-center justify-center"
        >
          <!-- Text variant -->
          <div
            class="d-none d-md-flex flex-row align-center primary justify-center"
          >
            <v-btn
              small
              :plain="!isActive(route)"
              :text="isActive(route)"
              elevation="0"
              class="white--text"
              v-for="(route, index) in routes"
              :key="'route' + index"
              @click="redirect(route)"
              >{{ route.name.toUpperCase() }}
            </v-btn>
          </div>

          <!-- Icon variant -->
          <div
            class="w-full d-flex d-md-none align-center justify-space-around mb-5 mt-2"
          >
            <div
              class="d-flex flex-column align-center justify-space-around"
              v-for="(route, index) in routes"
              :key="'routeIcon' + index"
            >
              <v-btn
                fab
                :outlined="!isActive(route)"
                x-small
                elevation="0"
                color="white"
                @click="redirect(route)"
              >
                <v-icon :color="!isActive(route) ? 'white' : 'primary'"
                  >{{ route.icon }}
                </v-icon>
              </v-btn>

              <p class="text-caption mb-0 mt-2 white--text text-center">
                {{ route.name }}
              </p>
            </div>

            <v-divider vertical class="white" />

            <div class="d-flex flex-column align-center justify-end">
              <v-btn
                fab
                x-small
                elevation="0"
                color="white"
                @click="triggerLogout"
              >
                <v-icon color="primary"> mdi-logout-variant</v-icon>
              </v-btn>
              <p class="text-caption mb-0 mt-2 white--text text-center">
                Sign Out
              </p>
            </div>
          </div>
        </v-col>

        <v-col
          cols="0"
          sm="0"
          md="3"
          xl="4"
          class="d-none d-md-flex justify-end"
        >
          <!-- Shows only on medium and up breakpoints -->
          <div class="w-full d-none d-md-flex align-center justify-end">
            <!-- <p
              class="text-subtitle-2 d-none d-lg-flex pa-0 ma-0 mr-2 white--text"
            >
              Sign out
            </p> -->
            <v-btn fab small elevation="0" color="white" @click="triggerLogout">
              <v-icon color="primary" size="20"> mdi-logout-variant</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { auth } from "@/utils/auth";

export default {
  name: "Navigation",
  data: () => ({
    institution: {
      name: "Systems Plus College Foundation",
      acronym: "SPCF",
      logo: require("@/assets/logos/SPCFLogo.png"),
    },

    activeButton: null,

    routes: [
      {
        name: "Dashboard",
        route: "Dashboard",
        icon: "mdi-view-dashboard-outline",
        childRouteNames: [],
      },
      {
        name: "Transactions",
        route: "Transactions",
        icon: "mdi-clipboard-text-clock-outline",
        childRouteNames: [],
      },
      {
        name: "Guests",
        route: "Guests",
        icon: "mdi-account-multiple-outline",
        childRouteNames: [],
      },
      {
        name: "Hotel Rooms",
        route: "Amenities",
        icon: "mdi-sofa-single-outline",
        childRouteNames: [
          "Amenities",
          "Occupied Rooms",
          "Room Categories",
          // "Availability",
        ],
      },
      {
        name: "Cashier",
        route: "Cashier Terminal",
        icon: "mdi-cash-register",
        childRouteNames: [],
      },
    ],
  }),
  computed: {
    activeRouteButton: function () {
      return this.activeButton
        ? this.activeButton
        : this.$route.meta.selectedMainNav;
    },
  },

  methods: {
    ...mapActions("authentication", ["logout"]),

    redirect: function (route) {
      this.activeButton = route.name;
      return this.$router.push({ name: route.route });
    },

    isActive: function (route) {
      if (
        route.childRouteNames.includes(this.activeRouteButton) ||
        this.activeRouteButton === route.name
      ) {
        return true;
      }
      return false;
    },

    triggerLogout: function () {
      this.logout(auth.user().role);
    },
  },

  mounted() {
    this.activeButton = this.$router.currentRoute.meta.name;
  },
};
</script>

<style scoped>
.active-route {
  font-weight: bold;
}

.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
