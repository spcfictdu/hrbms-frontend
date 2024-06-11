<template>
  <div class="mt-10">
    <v-row>
      <v-col cols="12">
        <RoomImages :images="roomImages"/>
      </v-col>
      <v-col cols="12">
        <RoomDetails :category="roomCategory" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomImages from "../../../components/hotel-rooms/categories/RoomImages.vue";
import RoomDetails from "../../../components/hotel-rooms/categories/RoomDetails.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "RoomDetailsView",
  components: { RoomImages, RoomDetails },
  data: () => ({
    hello: "world",
    referenceNumber: null,
  }),
  methods: {
    ...mapActions("roomCategories", ["fetchRoomCategory"]),
    // API Calls
    fetchRoomCategoryMethod: function () {
      this.referenceNumber = this.$route.params.roomCategoryReferenceNumber;
      this.fetchRoomCategory({
        roomTypeReferenceNumber: this.referenceNumber,
      });
    },
  },
  computed: {
    ...mapState("roomCategories", {
      roomCategory: "roomCategory",
    }),
    roomImages: function () {
      return this.roomCategory ? this.roomCategory.images : [];
    }
  },
  created() {
    this.fetchRoomCategoryMethod();
  },
};
</script>

<style scoped></style>
