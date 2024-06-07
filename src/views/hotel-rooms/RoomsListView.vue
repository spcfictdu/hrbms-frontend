<template>
  <div class="mt-10">
    <RoomsList v-if="rooms" @query-pagination="attachQuery" :rooms="rooms" />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/rooms/RoomsList.vue";
import { mapActions, mapState } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "RoomsListView",
  mixins: [assignParams],
  components: { RoomsList },
  data: () => ({
    hello: "world",
  }),
  methods: {
    ...mapActions("rooms", ["fetchRooms"]),
    attachQuery: function (params) {
      this.assignParams(params);
    }
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
        this.assignParams(newVal);
      },
    },
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.fetchRooms(newVal);
      }
    }
  },
  created() {
    this.fetchRooms();
  },
};
</script>

<style scoped></style>
