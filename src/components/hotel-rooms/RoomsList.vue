<template>
  <div>
    <v-row>
      <v-col cols="12" v-for="i in 18" :key="i">
        <RoomCard :room="room" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomCard from "./RoomCard.vue";

export default {
  name: "RoomsList",
  components: { RoomCard },
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

<style scoped></style>
