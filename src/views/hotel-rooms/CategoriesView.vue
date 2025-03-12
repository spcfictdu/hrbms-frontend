<template>
  <RouteLoader :target="hasData" class="mt-10">
    <div>
      <room-type-buttons
        :withAllRooms="withAllRooms"
        @input-event="attachType"
      />
      <RoomsList
        @redirect-event="redirect"
        @onQuery="attachQuery"
        :roomCategories="roomCategories"
        :loading="loading.fetch"
      />
    </div>
  </RouteLoader>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/categories/RoomsList.vue";
import RoomTypeButtons from "@/components/buttons/RoomTypeButtons.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "CategoriesView",
  mixins: [assignParams],
  components: { RoomsList, RoomTypeButtons, RouteLoader },
  data: () => ({
    withAllRooms: true,
    queryParams: {
      perPage: 5,
      page: 1,
    },
  }),
  created: function () {
    this.fetch(this.queryParams);
  },
  methods: {
    ...mapActions("roomCategories", ["fetchRoomCategories"]),
    fetch: function (queryParams = {}) {
      this.fetchRoomCategories(queryParams);
    },
    attachQuery: function (params) {
      this.assignParams(params);
    },
    attachType: function (type) {
      let roomTypePayload = {
        roomType: type === "All Rooms" ? null : type,
      };
      this.assignParams(roomTypePayload);
    },
    redirect: function (referenceNumber) {
      this.$router.push({
        name: "Room Details",
        params: { roomCategoryReferenceNumber: referenceNumber },
      });
    },
  },
  computed: {
    ...mapState("roomCategories", ["roomCategories", "loading"]),
    hasData: function () {
      return !!this.roomCategories ?? false;
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        console.log(newVal);
        this.fetch(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
