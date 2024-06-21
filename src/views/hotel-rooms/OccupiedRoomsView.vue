<template>
  <div class="mt-8">
    <OccupiedRoomsComponent :roomStatus="roomStatus"/>
  </div>
</template>

<script>
import OccupiedRoomsComponent from "@/components/hotel-rooms/occupied/OccupiedRoomsComponent.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "OccupiedRoomsView",
  components: { OccupiedRoomsComponent },
  data: () => ({}),
  computed: {
    ...mapState("occupied", {
      roomStatus: "roomStatus",
    }),
  },
  methods: {
    ...mapActions("occupied", ["fetchRoomStatus"]),
  },
  created() {
    this.fetchRoomStatus();
  },
};
</script>

<style scoped></style>
