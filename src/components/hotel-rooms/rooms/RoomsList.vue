<template>
  <div>
    <v-row>
      <v-col cols="12" v-for="(room, index) in roomArray" :key="index">
        <RoomCard :room="room" />
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
import RoomCard from "../RoomCard.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "RoomsList",
  mixins: [assignParams],
  props: {
    rooms: {
      type: Object,
      required: true,
    },
  },
  components: { RoomCard },
  data: () => ({
    page: 1,
    // room: {
    //   name: "The Serenity Suite",
    //   category: "Family Room",
    //   maxOccupancy: 2,
    //   amenities: [
    //     "Spectacular views",
    //     "Luxurious bedding",
    //     "Modern bathroom with deluxe toiletries",
    //     "Private outdoor space",
    //     "Spectacular views",
    //     "Luxurious bedding",
    //     "Modern bathroom with deluxe toiletries",
    //     "Private outdoor space",
    //   ],
    // },
  }),
  methods: {},
  computed: {
    roomArray: function () {
      return this.rooms
        ? this.rooms.rooms.map((key) => ({
            name: String(key.roomNumber),
            category: key.roomType.name,
            maxOccupancy: key.roomType.capacity,
            amenities: key.roomType.amenities,
            image: key.roomType.image,
            referenceNumber: key.referenceNumber,
            description: key.roomType.description,
          }))
        : [];
    },
    paginationLastPage: function () {
      return this.rooms ? this.rooms.pagination.lastPage : 1;
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
    "rooms.pagination": {
      deep: true,
      handler: function (newVal) {
        this.page = newVal.currentPage;
      }
    }
  },
};
</script>

<style scoped></style>
