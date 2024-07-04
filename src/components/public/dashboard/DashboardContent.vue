<template>
  <v-row class="gap-size">
    <div style="width: 100%" v-if="rooms.isQuery">
      <v-col
        cols="12"
        class="col-padding"
        v-for="(room, index) in mappedFilteredRooms"
        :key="'query' + index"
      >
        <room-card
          :room="room"
          @redirect-event="(e) => $emit('redirect-event', e)"
        />
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
import RoomCard from "@/components/cards/RoomCard.vue";
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
  data: () => ({}),
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
