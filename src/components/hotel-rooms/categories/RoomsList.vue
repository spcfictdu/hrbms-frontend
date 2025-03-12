<template>
  <div>
    <v-row v-if="roomArray.length > 0">
      <!-- With Data -->
      <v-col cols="12" v-for="(room, index) in roomArray" :key="index">
        <RoomCard
          @redirect-event="
            (referenceNumber) => $emit('redirect-event', referenceNumber)
          "
          :room="room"
        />
      </v-col>
      <!-- No Data Found -->
    </v-row>
    <v-row v-else>
      <v-col>
        <NoDataFoundCard :meta="noDataCardMeta" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-pagination :length="paginationLength" v-model="queryParams.page" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomCard from "../../cards/RoomCard.vue";
import NoDataFoundCard from "@/components/cards/NoDataFoundCard.vue";
export default {
  name: "RoomsList",
  components: { RoomCard, NoDataFoundCard },
  props: {
    roomCategories: Object,
    loading: Boolean,
  },
  data: () => ({
    queryParams: {
      perPage: 5,
      page: 1,
    },
  }),
  computed: {
    roomArray: function () {
      return this.roomCategories
        ? this.roomCategories.roomTypes.map((key) => ({
            name: key.name,
            price: key.price,
            maxOccupancy: key.capacity,
            totalRooms: key.totalRooms,
            image: key.image,
            referenceNumber: key.referenceNumber,
            description: key.description,
          }))
        : [];
    },
    paginationLength: function () {
      return this.roomCategories ? this.roomCategories.pagination.lastPage : 1;
    },
    noDataCardMeta: function () {
      return {
        title: "categories",
        loading: this.loading,
      };
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: function (newVal) {
        this.$emit("onQuery", newVal);
      },
    },
    "roomCategories.pagination": {
      deep: true,
      handler: function (newVal) {
        this.queryParams.page = newVal.currentPage;
      },
    },
  },
};
</script>

<style scoped></style>
