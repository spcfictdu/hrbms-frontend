<template>
  <v-container class="pa-0">
    <div
      class="w-full d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <p
        class="text-md-h5 text-h6 text-uppercase font-weight-bold mb-2 mb-sm-1"
      >
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

    <div
      v-if="!$route.meta.hideInputs"
      class="w-full d-flex flex-column flex-md-row align-md-center justify-md-space-between py-6"
    >
      <!-- Amenities Tabs -->
      <div v-if="$route.name === 'Amenities'">
        <v-btn
          v-for="tab in amenitiesTabs"
          :key="tab"
          rounded
          depressed
          :color="activeAmenitiesTab === tab ? 'primary' : 'lightBg'"
          :class="{ 'inactive-tab': activeAmenitiesTab !== tab }"
          class="font-weight-bold px-6 mr-3"
          @click="setActiveAmenitiesTab(tab)"
        >
          {{ tab }}
        </v-btn>
      </div>

      <div class="w-full d-flex align-center order-first order-md-last ml-auto">
        <v-text-field
          v-if="$route.name === 'Occupied Rooms'"
          dense
          rounded
          hide-details
          filled
          full-width
          prepend-inner-icon="mdi-magnify"
          placeholder="Search for room here..."
          v-model="search"
          background-color="lightBg"
          @keyup="handleRoomSearch"
        />

        <div v-for="button in addButtons" :key="button.name">
          <v-btn
            v-if="isForCurrentTab(button.name) || $route.name !== 'Amenities'"
            outlined
            rounded
            color="primary"
            class="d-none d-md-flex font-weight-bold add-button-bg ml-5"
            @click="handleClick(button)"
          >
            <v-icon left>mdi-plus</v-icon>
            {{ button.name }}
          </v-btn>

          <v-btn
            v-if="isForCurrentTab(button.name) || $route.name !== 'Amenities'"
            x-small
            outlined
            elevation="0"
            color="primary"
            fab
            @click="handleClick(button)"
            class="d-flex d-md-none font-weight-bold add-button-bg ml-5"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>

      <div
        v-if="$router.currentRoute.meta.name !== 'Categories'"
        class="d-md-flex chip-wrapper order-last order-md-first"
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

    <v-divider />
  </v-container>
</template>

<script>
import { assignParams } from "@/mixins/FormattingFunctions";
import { mapActions, mapMutations, mapState } from "vuex";

mapActions;
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
    ],
    amenitiesTabs: ["Amenities", "Add-ons"],
  }),
  computed: {
    ...mapState("amenities", ["activeAmenitiesTab"]),
    ...mapState("dialogs", ["dialog_message"]),
    activeRouteButton: function () {
      return this.activeButton;
    },
    activeChipButtion: function () {
      return this.activeChip;
    },
    showControls() {
      return this.$route.meta.hideInputs ? false : true;
    },
    size() {
      return this.$vuetify.breakpoint;
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
    addButtons: function () {
      const metaName = this.$route.meta.name;
      const buttonsData = [];
      switch (metaName) {
        case "Amenities":
          buttonsData.push({
            name: "Amenity",
            action: () => {
              this.setDialogFn({ key: "amenity_dialog", value: true });
            },
          });
          buttonsData.push({
            name: "Add-on",
            action: () => {
              this.setDialogFn({ key: "amenity_dialog", value: true });
            },
          });
          break;
        case "Occupied Rooms":
          buttonsData.push({
            name: "Room",
            action: () => {
              this.setDialogFn({ key: "room_dialog", value: true });
            },
          });
          break;
        case "Room Categories":
          buttonsData.push({
            name: "Category",
            route: { name: "Categories", route: "Create Room" },
          });
          break;
        default:
      }
      return buttonsData;
    },
  },
  methods: {
    ...mapActions("dialogs", ["setDialogFn", "setDialogMessage"]),
    ...mapActions("amenities", ["setActiveAmenitiesTab"]),
    ...mapActions("occupied", ["fetchRoomStatus"]),
    ...mapMutations("occupied", ["SET_ROOM_SEARCH_QUERY"]),
    handleClick(button) {
      if (this.$route.name === "Amenities") this.setDialogMessage(button.name);

      this.redirect(button);
    },
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
    handleRoomSearch() {
      this.SET_ROOM_SEARCH_QUERY(this.search);
    },
    isForCurrentTab(buttonName) {
      if (this.activeAmenitiesTab === "Amenities")
        return "Amenity" === buttonName;
      if (this.activeAmenitiesTab === "Add-ons") return "Add-on" === buttonName;
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
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

.add-button-bg {
  background-color: #fcfcfc;
}

.inactive-tab {
  color: #555555;
}

.v-text-field__slot input::placeholder {
  font-size: 12px !important;
}
</style>
