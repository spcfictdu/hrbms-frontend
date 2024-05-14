<template>
  <div class="px-lg-16 py-8">
    <!-- <HotelRoomsHeader />
    <v-divider class="mb-5"/>
    <RoomsList /> -->
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/RoomsList.vue";
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
export default {
  name: "HotelRoomsView",
  components: { RoomsList, HotelRoomsHeader },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
