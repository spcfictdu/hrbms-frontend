<template>
  <div class="mt-10">
    <room-type-buttons @input-event="attachType" />
    <RoomsList v-if="roomCategories" @redirect-event="redirect" @query-pagination="attachQuery" :roomCategories="roomCategories" />
  </div>
</template>

<script>
import RoomsList from "../../components/hotel-rooms/categories/RoomsList.vue";
import RoomTypeButtons from "@/components/hotel-rooms/RoomTypeButtons.vue";
import { mapActions, mapState } from "vuex";
import { assignParams } from "@/mixins/FormattingFunctions";

export default {
  name: "CategoriesView",
  mixins: [assignParams],
  components: { RoomsList, RoomTypeButtons },
  data: () => ({
    hello: "world",
  }),
  methods: {
    ...mapActions("roomCategories", ["fetchRoomCategories"]),
    attachQuery: function (params) {
      this.assignParams(params);
    },
    attachType: function (type) {
      const object = {
        roomType: type,
      };
      this.assignParams(object);
    },
    redirect: function (referenceNumber) {
      this.$router.push({
        name: "Room Details",
        params: { roomCategoryReferenceNumber: referenceNumber },
      });
    }
  },
  computed: {
    ...mapState("roomCategories", {
      roomCategories: "roomCategories",
    }),
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.fetchRoomCategories(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
