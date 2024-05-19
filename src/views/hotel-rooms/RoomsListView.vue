<template>
  <div class="mt-10">
    <RoomsList />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/RoomsList.vue";
export default {
  name: "RoomsListView",
  components: { RoomsList },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
