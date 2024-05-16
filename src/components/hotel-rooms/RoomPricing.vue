<template>
  <v-card elevation="0 pa-4">
    <div
      class="d-flex flex-md-row flex-column justify-md-space-between align-md-center"
    >
      <p class="text-subtitle-2 font-weight-bold">STANDARD ROOM</p>
      <div class="d-flex align-center">
        <p class="text-caption font-weight-regular">
          <span class="mr-md-2">
            <v-chip small color="primary" class="text-subtitle-2 white--text"
              >DreamStay Discount</v-chip
            >
          </span>
          February 10, 2024 - March 10, 2024
        </p>

        <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
      </div>
    </div>
    <v-data-table
      elevation="0"
      dense
      hide-default-footer
      class="price-table"
      :headers="headers"
      :items="prices"
      :items-per-page="5"
    ></v-data-table>
  </v-card>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/RoomsList.vue";
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
export default {
  name: "RoomPricing",
  components: { RoomsList, HotelRoomsHeader },
  data: () => ({
    headers: [
      {
        text: "Rates (in peso)",
        value: "rate",
      },
      {
        text: "Sun",
        value: "sunday",
      },
      {
        text: "Mon",
        value: "monday",
      },
      {
        text: "Tue",
        value: "tuesday",
      },
      {
        text: "Wed",
        value: "wednesday",
      },
      {
        text: "Thu",
        value: "thursday",
      },
      {
        text: "Fri",
        value: "friday",
      },
      {
        text: "Sat",
        value: "saturday",
      },
    ],

    prices: [
      {
        rate: "Regular rate",
        sunday: 1000,
        monday: 1000,
        tuesday: 1000,
        wednesday: 1000,
        thursday: 1000,
        friday: 1000,
        saturday: 1000,
      },
      {
        rate: "Special rate",
        sunday: 700,
        monday: 700,
        tuesday: 700,
        wednesday: 700,
        thursday: 700,
        friday: 700,
        saturday: 700,
      },
    ],
  }),
};
</script>

<style scoped></style>
