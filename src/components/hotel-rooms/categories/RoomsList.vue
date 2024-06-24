<template>
  <div>
    <v-row>
      <v-col cols="12" v-for="(room, index) in roomArray" :key="index">
        <RoomCard
          @redirect-event="
            (referenceNumber) => $emit('redirect-event', referenceNumber)
          "
          :room="room"
        />
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
import RoomCard from "./RoomCard.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "RoomsList",
  mixins: [assignParams],
  props: {
    roomCategories: {
      type: Object,
      required: true,
    },
  },
  components: { RoomCard },
  data: () => ({
    page: 1,
    status: ["Available", "Occupied", "Unallocated", "Unclean"]
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
