<template>
  <div>
    <HotelRoomsHeader />
    <v-divider class="mb-10" />
    <RoomsList />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/RoomsList.vue";
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
export default {
  name: "RoomsListView",
  components: { RoomsList, HotelRoomsHeader },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
