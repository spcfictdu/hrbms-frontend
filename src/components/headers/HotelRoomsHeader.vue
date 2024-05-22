<template>
  <v-container class="pa-0">
    <div
      class="w-full d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <p class="text-md-h5 text-h6 font-weight-bold mb-2 mb-sm-1">
        {{ $route.meta.name }}
      </p>
      <div class="w-full d-none d-sm-flex flex-row align-center justify-center">
        <v-btn
          small
          :plain="route.name !== activeRouteButton"
          :text="route.name === activeRouteButton"
          elevation="0"
          v-for="(route, index) in routes"
          :key="'route' + index"
          @click="redirect(route)"
          >{{ route.name.toUpperCase() }}</v-btn
        >
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
          >{{ route.name.toUpperCase() }}</v-btn
        >
      </div>
    </div>

    <v-divider />

    <div
      v-if="!$route.meta.hideInputs"
      class="w-full d-flex flex-column flex-md-row align-md-center justify-md-space-between py-2"
    >
      <div
        class="w-full d-flex align-center order-first order-md-last ml-md-auto"
      >
        <v-text-field
          block
          dense
          rounded
          hide-details
          filled
          full-width
          prepend-inner-icon="mdi-magnify"
          placeholder="Search for room here..."
          class="mr-2 ml-md-2"
        />
        <v-btn
          v-if="$router.currentRoute.meta.name !== 'Categories'"
          outlined
          rounded
          color="primary"
          class="d-none d-md-flex"
          @click="redirect({name: 'Rooms', route: 'Create Room'})"
        >
          <v-icon left>mdi-plus</v-icon>
          ROOM
        </v-btn>

        <v-btn v-else outlined rounded color="primary" class="d-none d-md-flex">
          <v-icon left>mdi-plus</v-icon>
          CATEGORY
        </v-btn>

        <v-btn
          fab
          small
          elevation="0"
          color="primary"
          @click="redirect(route)"
          class="d-flex d-md-none"
        >
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
      </div>

      <div
        v-if="$router.currentRoute.meta.name !== 'Categories'"
        class="d-none d-md-flex chip-wrapper order-last order-md-first"
      >
        <v-chip
          small
          color="primary"
          :outlined="chip !== 'All'"
          v-for="chip in chips"
          :key="chip"
        >
          {{ chip }}
        </v-chip>
      </div>
    </div>

    <!-- <div class="d-flex flex-column flex-md-row align-center py-3">
      <div class="chip-wrapper order-last order-md-first">
        <v-chip
          small
          color="primary"
          :outlined="chip !== 'All'"
          v-for="chip in chips"
          :key="chip"
        >
          {{ chip }}
        </v-chip>
      </div>

      <div class="d-flex align-center ml-md-auto order-first order-md-last">
        <v-text-field
          block
          dense
          rounded
          hide-details
          filled
          prepend-inner-icon="mdi-magnify"
          placeholder="Search for room here..."
        />
        <v-btn outlined rounded color="primary" class="ml-4">
          <v-icon left>mdi-plus</v-icon>
          ROOM
        </v-btn>
      </div>
    </div> -->
  </v-container>
</template>

<script>
export default {
  name: "HotelRoomsHeader",
  data: () => ({
    activeButton: null,
    toHideFrom: ["Categories", "Booking", "Availability"],
    routes: [
      {
        name: "Rooms",
        route: "Rooms List",
      },
      {
        name: "Occupied",
        route: "Occupied",
      },
      {
        name: "Categories",
        route: "Room Categories",
      },
      {
        name: "Availability",
        route: "Availability",
      },
    ],

    chips: [
      "All",
      "Deluxe",
      "Junior",
      "Executive",
      "Presidential",
      "Superior",
      "Standard",
      "Family",
    ],
  }),
  computed: {
    activeRouteButton: function () {
      return this.activeButton;
    },
    showControls() {
      return this.$route.meta.hideInputs ? false : true;
    },
    test() {
      return this.$router.currentRoute.meta.name;
    },
  },

  methods: {
    redirect: function (route) {
      this.activeButton = route.name;
      return this.$router.push({ name: route.route });
    },
  },
  mounted() {
    this.activeButton = this.$router.currentRoute.meta.name;
  },
  watch: {
    test: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        console.log(newVal);
      },
    },
  },
};
</script>

<style scoped>
.chip-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.header-nav-buttons-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-nav-buttons {
  font-weight: normal;
  border-radius: 10px;
  cursor: default;
}

.header-nav-buttons:hover {
  background-color: #ecefff;
}
</style>
