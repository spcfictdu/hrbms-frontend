<template>
  <div class="mt-10">
    <RoomsList v-if="rooms" :rooms="rooms" />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/rooms/RoomsList.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "RoomsListView",
  components: { RoomsList },
  data: () => ({
    hello: "world",
  }),
  methods: {
    ...mapActions("rooms", ["fetchRooms"]),
  },
  computed: {
    ...mapState("rooms", {
      rooms: "rooms",
    }),
  },
  watch: {
    rooms: {
      handler: function (newVal) {
        console.log(newVal);
      },
    },
  },
  created() {
    this.fetchRooms();
  },
};
</script>

<style scoped></style>
