<template>
  <v-row class="gap-size">
    <div v-if="false">

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
        v-for="(room, index) in roomCategories"
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
export default {
  name: "DashboardContent",
  components: { TitleSection, CardSectionOne, CardSectionTwo, AboutSection },
  data: () => ({
    roomCategories: [
      {
        image: require("../../../assets/bgImage-5.png"),
        data: {
          name: "Executive Room",
          price: 1000,
          maxOccupancy: 2,
          description:
            "Experience luxury in our Deluxe King Room, featuring a plush king-size bed, a stylish seating area, and modern amenities like a flat-screen TV and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating rain shower and luxurious toiletries, complemented by stunning city views through large windows.",
          amenities: [
            "Wi-Fi Access",
            "Coffee/Tea Maker",
            "Flat-Screen Television",
            "Mini-Bar",
            "Room Service",
            "In-Room Safe",
          ],
        },
      },
      {
        image: [
          require("../../../assets/bgImage-5.png"),
          require("../../../assets/bgImage-5.png"),
        ],
        data: {
          name: "Deluve Room",
          price: 800,
          maxOccupancy: 3,
          description:
            "Experience luxury in our Deluxe King Room, featuring a plush king-size bed, a stylish seating area, and modern amenities like a flat-screen TV and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating rain shower and luxurious toiletries, complemented by stunning city views through large windows.",
          amenities: [
            "Wi-Fi Access",
            "Coffee/Tea Maker",
            "Flat-Screen Television",
            "Mini-Bar",
            "Room Service",
            "In-Room Safe",
          ],
        },
      },
      {
        image: require("../../../assets/bgImage-5.png"),
        data: {
          name: "Superior Room",
          price: 1200,
          maxOccupancy: 4,
          description:
            "Experience luxury in our Deluxe King Room, featuring a plush king-size bed, a stylish seating area, and modern amenities like a flat-screen TV and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating rain shower and luxurious toiletries, complemented by stunning city views through large windows.",
          amenities: [
            "Wi-Fi Access",
            "Coffee/Tea Maker",
            "Flat-Screen Television",
            "Mini-Bar",
            "Room Service",
            "In-Room Safe",
          ],
        },
      },
    ],
  }),
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
