<template>
  <v-row class="gap-size">
    <div style="width: 100%" v-if="rooms.isQuery">
      <v-col
        cols="12"
        class="col-padding"
        v-for="(room, index) in mappedFilteredRooms"
        :key="'query' + index"
      >
        <room-card :room="room" />
      </v-col>
    </div>

    <div style="width: 100%" v-else>
      <!-- Title Section -->
      <v-col cols="12" class="col-padding">
        <title-section />
      </v-col>

      <!-- Loops -->
      <v-col
        cols="12"
        class="col-padding"
        v-for="(room, index) in rooms.results"
        :key="index"
      >
        <card-section-one :room="room" v-if="(index + 1) % 2 === 1" />
        <card-section-two :room="room" v-else />
      </v-col>

      <!-- Bottom Section -->
      <v-col cols="12" class="col-padding">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" class="col-padding">
        <about-section />
      </v-col>
    </div>
  </v-row>
</template>

<script>
import CardSectionOne from "./CardSectionOne.vue";
import TitleSection from "./TitleSection.vue";
import CardSectionTwo from "./CardSectionTwo.vue";
import AboutSection from "./AboutSection.vue";
import RoomCard from "@/components/hotel-rooms/categories/RoomCard.vue";
export default {
  name: "DashboardContent",
  props: { rooms: Object },
  components: {
    TitleSection,
    CardSectionOne,
    CardSectionTwo,
    AboutSection,
    RoomCard,
  },
  data: () => ({
    roomCard: [
      {
        image: require("../../../assets/bgImage-5.png"),
        name: "Deluxe Room",
        price: 1000,
        maxOccupancy: 2,
        description:
          "Experience luxury in our Deluxe King Room, featuring a plush king-size bed, a stylish seating area, and modern amenities like a flat-screen TV and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating rain shower and luxurious toiletries, complemented by stunning city views through large windows.",
        totalRooms: 14,
        referenceNumber: "",
      },
      {
        image: require("../../../assets/bgImage-5.png"),
        name: "Superior Room",
        price: 2000,
        maxOccupancy: 4,
        description:
          "Experience luxury in our Deluxe King Room, featuring a plush king-size bed, a stylish seating area, and modern amenities like a flat-screen TV and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating rain shower and luxurious toiletries, complemented by stunning city views through large windows.",
        totalRooms: 8,
        referenceNumber: "",
      },
      {
        image: require("../../../assets/bgImage-5.png"),
        name: "Executive Room",
        price: 1600,
        maxOccupancy: 3,
        description:
          "Experience luxury in our Deluxe King Room, featuring a plush king-size bed, a stylish seating area, and modern amenities like a flat-screen TV and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating rain shower and luxurious toiletries, complemented by stunning city views through large windows.",
        totalRooms: 12,
        referenceNumber: "",
      },
    ],
  }),
  computed: {
    mappedFilteredRooms: function () {
      return this.rooms.isQuery && this.rooms.results
        ? this.rooms.results.data.map((key) => ({
          image: key.image,
          name: key.name,
          price: key.rate,
          maxOccupancy: key.capacity,
          description: key.description,
          totalRooms: key.roomsAvailable,
          referenceNumber: key.referenceNumber,
        }))
        : [];
    },
  },
};
</script>

<style scoped>
.gap-size {
  row-gap: 10px;
}

.gap-size > div > .col-padding {
  padding: 12px 0;
}

.divider-breakpoint {
  width: 100%;
  border-bottom: 1px dotted rgba(51, 51, 51, 0.3);
  margin: 16px 0;
}
</style>
