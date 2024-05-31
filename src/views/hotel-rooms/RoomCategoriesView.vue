<template>
  <div class="mt-10" v-if="roomPrice">
    <RoomPricing :roomPrice="roomPrice"/>
  </div>
</template>

<script>
import RoomPricing from "../../components/hotel-rooms/RoomPricing.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "RoomCategoriesView",
  components: { RoomPricing },
  data: () => ({
    hello: "world",
  }),
  methods: {
    ...mapActions("roomPrice", ["fetchRoomPrice"]),
  },
  computed: {
    ...mapState("roomPrice", {
      roomPrice: "roomPrice",
    }),
  },
  created(){
    this.fetchRoomPrice();
  }
};
</script>

<style scoped></style>
