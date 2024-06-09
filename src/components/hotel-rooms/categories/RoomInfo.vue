<template>
  <div>
    <div class="d-flex flex-row align-start justify-space-between mb-4 mb-md-0">
      <div>
        <p class="text-h6 font-weight-bold mb-0">
          {{ room.name.toUpperCase() }}
        </p>
        <p class="text-subtitle-2 font-weight-regular">
          <PriceSlot>
            <template v-slot:price> {{ room.price }} </template>
          </PriceSlot>
          {{ ` | ${room.maxOccupancy} max occupancy` }}
        </p>
      </div>

      <div class="d-flex">
        <v-btn icon outlined color="primary"
          ><v-icon small>mdi-pencil</v-icon></v-btn
        >
        <!-- Add Menu here -->
      </div>
    </div>

    <div>
      <p class="text-body-2 longText--text">
        {{ room.description }}
      </p>
    </div>

    <v-divider class="mb-5 mt-7" />

    <div>
      <p class="text-overline font-weight-bold">Amenities</p>
      <div>
        <v-chip
          outlined
          small
          class="mr-2 mb-1 text-subtitle-2"
          v-for="(amenity, i) in room.amenities"
          :key="i"
          :color="i % 2 === 0 ? 'primary' : 'accentOne'"
          >{{ amenity }}</v-chip
        >
      </div>
    </div>

    <v-divider class="mb-5 mt-7" />

    <div>
      <div
        class="d-flex flex-md-row flex-column justify-md-space-between align-md-center"
      >
        <p class="text-overline font-weight-bold">Price Rates</p>
        <p class="text-caption font-weight-regular">
          February 10, 2024 - March 10, 2024
          <span class="ml-md-2">
            <v-chip small color="primary" outlined class="text-subtitle-2"
              >DreamStay Discount</v-chip
            >
          </span>
        </p>
      </div>
      <v-data-table
        elevation="0"
        dense
        hide-default-footer
        class="price-table"
        :headers="room.headers"
        :items="room.prices"
        :items-per-page="5"
      ></v-data-table>
    </div>

    <v-divider class="mb-5 mt-7" />

    <div>
      <p class="text-overline font-weight-bold">Rooms List</p>
      <v-row dense>
        <v-col cols="12" v-for="(iter, index) in room.rooms" :key="index">
          <RoomListCard :room="iter"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import PriceSlot from "../../slots/PriceSlot.vue";
import RoomListCard from "./RoomListCard.vue";
export default {
  name: "RoomInfo",
  props: {
    room: Object,
  },
  components: {
    PriceSlot,
    RoomListCard,
  },
  data: () => ({}),
};
</script>

<style scoped>
.price-table {
  background-color: transparent;
}
</style>
