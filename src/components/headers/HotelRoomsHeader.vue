<template>
  <v-container class="pa-0">
    <div class="d-flex flex-row align-center pb-3">
      <p class="text-h6 font-weight-bold ma-0 pa-0">
        {{ $router.currentRoute.meta.name }}
      </p>

      <div class="header-nav-buttons-wrapper ml-auto">
        <p
          class="header-nav-buttons text-subtitle-2 font-weight-regular pa-2 ma-0"
          v-for="(route, index) in routes"
          :key="index"
        >
          {{ route.name.toUpperCase() }}
        </p>
      </div>
    </div>

    <v-divider />

    <div class="d-flex flex-row align-center py-3">
      <div class="chip-wrapper">
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

      <div class="d-flex align-center ml-auto">
        <v-text-field
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
    </div>
  </v-container>
</template>

<script>
export default {
  name: "HotelRoomsHeader",
  data: () => ({
    hello: "world",

    routes: [
      {
        name: "Rooms",
        route: "Rooms",
      },
      {
        name: "Occupied",
        route: "Occupied",
      },
      {
        name: "Categories",
        route: "Categories",
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
