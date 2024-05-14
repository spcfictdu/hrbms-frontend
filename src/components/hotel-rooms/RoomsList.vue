<template>
  <div>
    <RoomCard :rooms="rooms" />
  </div>
</template>

<script>
import RoomCard from "./RoomCard.vue";

export default {
  name: "RoomsList",
  components: { RoomCard },
  data: () => ({
    rooms: [
      {
        name: "The Serenity Suite",
        category: "Family Room",
        maxOccupancy: 2,
        amenities: [
          "Spectacular views",
          "Luxurious bedding",
          "Modern bathroom with deluxe toiletries",
          "Private outdoor space",
        ],
      },
      {
        name: "The Serenity Suite",
        category: "Family Room",
        maxOccupancy: 2,
        amenities: [
          "Spectacular views",
          "Luxurious bedding",
          "Modern bathroom with deluxe toiletries",
          "Private outdoor space",
        ],
      },
      {
        name: "The Serenity Suite",
        category: "Family Room",
        maxOccupancy: 2,
        amenities: [
          "Spectacular views",
          "Luxurious bedding",
          "Modern bathroom with deluxe toiletries",
          "Private outdoor space",
        ],
      },
      {
        name: "The Serenity Suite",
        category: "Family Room",
        maxOccupancy: 2,
        amenities: [
          "Spectacular views",
          "Luxurious bedding",
          "Modern bathroom with deluxe toiletries",
          "Private outdoor space",
        ],
      },
    ],
  }),
};
</script>

<style scoped></style>
