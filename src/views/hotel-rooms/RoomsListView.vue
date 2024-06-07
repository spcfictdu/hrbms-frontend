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
    queryResult: function () {
      return this.$route.query;
    },
  },
  watch: {
    rooms: {
      handler: function () {},
    },
    queryResult: {
      deep: true,
      handler: function (newVal) {
        this.fetchRooms(newVal);
      },
    },
  },
  created() {
    this.fetchRooms();
  },
};
</script>

<style scoped></style>
