<template>
  <div>
    <v-row>
      <v-col cols="12" v-for="(room, index) in roomArray" :key="index">
        <RoomCard :room="room" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomCard from "../RoomCard.vue";

export default {
  name: "RoomsList",
  props: {
    rooms: {
      type: Object,
      required: true,
    },
  },
  components: { RoomCard },
  data: () => ({
    // room: {
    //   name: "The Serenity Suite",
    //   category: "Family Room",
    //   maxOccupancy: 2,
    //   amenities: [
    //     "Spectacular views",
    //     "Luxurious bedding",
    //     "Modern bathroom with deluxe toiletries",
    //     "Private outdoor space",
    //     "Spectacular views",
    //     "Luxurious bedding",
    //     "Modern bathroom with deluxe toiletries",
    //     "Private outdoor space",
    //   ],
    // },
  }),
  methods: {},
  computed: {
    roomArray: function () {
      return this.rooms
        ? this.rooms.rooms.map((key) => ({
            name: String(key.roomNumber),
            category: key.roomType.name,
            maxOccupancy: key.roomType.capacity,
            amenities: key.roomType.amenities,
            image: key.roomType.image,
            referenceNumber: key.referenceNumber,
            description: key.roomType.description,
          }))
        : [];
    },
  },
};
</script>

<style scoped></style>
