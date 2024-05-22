<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-img
          class="room-images"
          height="300"
          src="../../assets/hotelRoom.png"
        />
      </v-col>
      <v-col cols="4">
        <v-img class="room-images" height="100" src="../../assets/hotelRoom.png" />
      </v-col>
      <v-col cols="4">
        <v-img class="room-images" height="100" src="../../assets/hotelRoom.png" />
      </v-col>
      <v-col cols="4">
        <v-img class="room-images" height="100" src="../../assets/hotelRoom.png" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "RoomImages",
  data: () => ({
    room: {
      name: "The Serenity Suite",
      category: "Family Room",
      maxOccupancy: 2,
      amenities: [
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom with deluxe toiletries",
        "Private outdoor space",
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom with deluxe toiletries",
        "Private outdoor space",
      ],
    },
  }),
};
</script>

<style scoped>
.room-images {
  border-radius: 3px;
}
</style>
