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
        class="w-full d-flex align-center order-first order-md-last ml-auto"
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
          class="mr-2 ml-md-2 d-none"
          v-model="search"
        />
        <v-btn
          v-if="$router.currentRoute.meta.name !== 'Room Categories'"
          outlined
          rounded
          color="primary"
          class="d-none d-md-flex"
          @click="redirect({ name: 'Rooms', route: 'Create Room' })"
        >
          <v-icon left>mdi-plus</v-icon>
          ROOM
        </v-btn>

        <v-btn
          v-else
          outlined
          rounded
          color="primary"
          class="d-none d-md-flex"
          @click="redirect({ name: 'Categories', route: 'Create Room' })"
        >
          <v-icon left>mdi-plus</v-icon>
          CATEGORY
        </v-btn>

        <v-btn
          rounded
          outlined
          elevation="0"
          color="primary"
          @click="redirect({ name: 'Categories', route: 'Create Room' })"
          class="d-flex d-md-none"
        >
          <v-icon left >mdi-plus</v-icon>Category
        </v-btn>
      </div>

      <div
        v-if="$router.currentRoute.meta.name !== 'Categories'"
        class="d-none d-md-flex chip-wrapper order-last order-md-first"
      >
        <v-chip
          small
          color="primary"
          :outlined="chip.roomType !== activeChipButtion"
          v-for="(chip, index) in chips"
          :key="index"
          @click="activateChip(chip.roomType)"
        >
          {{ chip.roomType }}
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
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "HotelRoomsHeader",
  mixins: [assignParams],
  data: () => ({
    activeButton: null,
    activeChip: "All",
    search: "",
    searchTimeout: null,
    toHideFrom: ["Categories", "Booking", "Availability"],
    routes: [
      {
        name: "Amenities",
        route: "Amenities",
      },
      {
        name: "Occupied",
        route: "Occupied Rooms",
      },
      {
        name: "Categories",
        route: "Room Categories",
      },
      // {
      //   name: "Availability",
      //   route: "Availability",
      // },
    ],
    // chips: [
    //   "All",
    //   "Deluxe",
    //   "Junior",
    //   "Executive",
    //   "Presidential",
    //   "Superior",
    //   "Standard",
    //   "Family",
    // ],
  }),
  computed: {
    activeRouteButton: function () {
      return this.activeButton;
    },
    activeChipButtion: function () {
      return this.activeChip;
    },
    showControls() {
      return this.$route.meta.hideInputs ? false : true;
    },
    chips: function () {
      const data = this.roomTypeEnum
        ? this.roomTypeEnum.map((key) => ({
            ...key,
            roomType: this.capitalizeString(key.roomType),
          }))
        : [];
      return data.length > 0
        ? [{ roomType: "All", referenceNumber: "" }, ...data]
        : [];
    },
  },
  methods: {
    redirect: function (route) {
      this.activeButton = route.name;
      return this.$router.push({ name: route.route });
    },
    activateChip: function (chip) {
      this.activeChip = chip;

      const object = {
        roomType: chip !== "All" ? chip.toUpperCase() : null,
      };
      this.assignParamsWithoutDelete(object);
    },
    capitalizeString(str) {
      const lowerCaseString = str.toLowerCase();
      return lowerCaseString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        console.log(newVal);
        return this.$router.replace({
          query: newVal,
        });
      },
    },
    search: {
      deep: true,
      handler: function (newVal) {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
          const object = {
            search: newVal,
          };
          this.assignParamsWithoutDelete(object);
        }, 300);
      },
    },
  },
  mounted() {
    this.activeButton = this.$router.currentRoute.meta.name;
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
