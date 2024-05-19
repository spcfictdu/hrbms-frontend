<template>
  <div class="mt-10">
    <RoomPricing />
  </div>
</template>

<script>
import RoomPricing from "../../components/hotel-rooms/RoomPricing.vue";
export default {
  name: "RoomCategoriesView",
  components: { RoomPricing },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
