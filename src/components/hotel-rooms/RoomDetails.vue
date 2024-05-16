<template>
  <div>
    <div class="d-flex flex-column flex-md-row align-start justify-space-between mb-4 mb-md-0">
      <div>
        <p class="text-h6 font-weight-bold mb-0">
          {{ room.name.toUpperCase() }}
        </p>
        <p class="text-subtitle-2 font-weight-regular">
          <span class="text-subtitle-2 font-weight-bold">{{
            room.category.toUpperCase()
          }}</span>
          {{ ` | ${room.maxOccupancy} max occupancy` }}
        </p>
      </div>

      <div class="d-flex">
        <v-btn outlined color="primary" elevation="0" class="mr-2"
          >Reserve</v-btn
        >
        <v-btn color="primary" elevation="0">Book Now</v-btn>
      </div>
    </div>

    <div>
      <p class="text-body-2 longText--text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, natus
        quam possimus cumque error itaque odio et ullam suscipit, aperiam fugit
        numquam temporibus voluptate ducimus. Accusantium odio impedit
        temporibus eum.
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
            <v-chip small color="accentOne" class="text-subtitle-2 white--text"
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
        :headers="headers"
        :items="prices"
        :items-per-page="5"
      ></v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomDetails",
  data: () => ({
    room: {
      name: "The Serenity Suite",
      category: "Family Room",
      maxOccupancy: 2,
      amenities: [
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom with toiletries",
        "Private outdoor space",
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom",
        "Private space",
      ],
    },

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

<style scoped>
.price-table {
  background-color: transparent;
}
</style>
