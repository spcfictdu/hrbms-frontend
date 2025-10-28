<template>
  <div class="mt-10">
    <RoomTypeButtons :withAllRooms="withAllRooms" @input-event="attachType" />
    <RoomsList
      @redirect-event="redirect"
      @onQuery="attachQuery"
      :roomCategories="roomCategories"
      :loading="loading"
    />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/categories/RoomsList.vue";
import RoomTypeButtons from "@/components/buttons/RoomTypeButtons.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "CategoriesView",
  mixins: [assignParams],
  components: { RoomsList, RoomTypeButtons },
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
    ...mapState("roomCategories", ["roomCategories"]),
    ...mapGetters("roomCategories", ["getLoading"]),

    loading() {
      return this.getLoading("roomCategories") && !this.roomCategories;
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.fetch(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
