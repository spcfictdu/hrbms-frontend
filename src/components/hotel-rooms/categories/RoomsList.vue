<template>
  <div>
    <v-row>
      <!-- With Data -->
      <div style="width: 100%" v-if="roomArray.length > 0">
        <v-col cols="12" v-for="(room, index) in roomArray" :key="index">
          <RoomCard
            @redirect-event="
              (referenceNumber) => $emit('redirect-event', referenceNumber)
            "
            :room="room"
          />
        </v-col>
      </div>
      <!-- No Data Found -->
      <v-col v-else>
        <no-data-found-card :meta="meta" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-pagination
          :length="paginationLastPage"
          v-model="page"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomCard from "../../cards/RoomCard.vue";
import NoDataFoundCard from "@/components/cards/NoDataFoundCard.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "RoomsList",
  mixins: [assignParams],
  props: {
    roomCategories: Object,
    meta: Object,
  },
  components: { RoomCard, NoDataFoundCard },
  data: () => ({
    page: 1,
    status: ["Available", "Occupied", "Unallocated", "Unclean"],
  }),
  methods: {},
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
    paginationLastPage: function () {
      return this.roomCategories ? this.roomCategories.pagination.lastPage : 1;
    },
  },
  watch: {
    page: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        const object = {
          perPage: 5,
          page: newVal,
        };
        this.assignParams(object);
      },
    },
    queryParams: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        this.$emit("query-pagination", newVal);
      },
    },
    "roomCategories.pagination": {
      deep: true,
      handler: function (newVal) {
        this.page = newVal.currentPage;
      },
    },
  },
};
</script>

<style scoped></style>
