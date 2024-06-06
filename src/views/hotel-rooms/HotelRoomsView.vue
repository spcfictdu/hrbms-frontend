<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <HotelRoomsHeader />
    <router-view />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/rooms/RoomsList.vue";
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
export default {
  name: "HotelRoomsView",
  components: { RoomsList, HotelRoomsHeader },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
