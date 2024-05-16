<template>
  <div>
    <HotelRoomsHeader />
    <v-divider class="mb-10" />
    <RoomPricing />
  </div>
</template>

<script>
import RoomPricing from "../../components/hotel-rooms/RoomPricing.vue";
import HotelRoomsHeader from "../../components/headers/HotelRoomsHeader.vue";
export default {
  name: "RoomCategoriesView",
  components: { RoomPricing, HotelRoomsHeader },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
