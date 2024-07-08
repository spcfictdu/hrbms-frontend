<template>
  <div class="mt-6">
    <v-row v-if="roomCategory">
      <v-col cols="12">
        <room-images-two :images="roomCategory.images" />
      </v-col>
      <v-col cols="12">
        <room-details
          @reservation-event="requestReservation"
          :category="roomCategory"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomImagesTwo from "@/components/layouts/images/RoomImagesTwo.vue";
import RoomDetails from "@/components/layouts/sections/RoomDetails.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestRoomDetailsView",
  components: { RoomImagesTwo, RoomDetails },
  data: () => ({}),
  methods: {
    ...mapActions("publicRooms", ["fetchPublicRoom"]),
    fetchRoomData: function (referenceNumber) {
      this.fetchPublicRoom(referenceNumber);
    },
    requestReservation: function (payload) {
      this.$router.push({
        name: "Guest Booking",
        query: payload,
      });
    },
  },
  computed: {
    ...mapState("publicRooms", {
      roomCategory: "room",
    }),
    referenceNumber: function () {
      return this.$route.params.referenceNumber;
    },
  },
  watch: {
    referenceNumber: {
      immediate: true,
      handler: function (newVal) {
        this.fetchRoomData(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
