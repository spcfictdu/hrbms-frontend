<template>
  <div class="mt-10" v-if="roomPrices">
    <RoomPricing :roomPrices="roomPrices"/>
  </div>
</template>

<script>
import RoomPricing from "../../components/hotel-rooms/categories/RoomPricing.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "RoomCategoriesViewOld",
  components: { RoomPricing },
  data: () => ({
    hello: "world",
  }),
  methods: {
    ...mapActions("roomPrice", ["fetchRoomPrice", "fetchRoomTypePrice"]),
  },
  computed: {
    ...mapState("roomPrice", {
      roomPrices: "roomPrice",
    }),
  },
  created(){
    this.fetchRoomPrice();
  }
};
</script>

<style scoped></style>
