<template>
  <div class="mt-10">
    <v-row>
      <v-col cols="12">
        <RoomImages />
      </v-col>
      <v-col cols="12">
        <RoomDetails />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomImages from "../../../components/hotel-rooms/categories/RoomImages.vue";
import RoomDetails from "../../../components/hotel-rooms/categories/RoomDetails.vue";

export default {
  name: "RoomDetailsView",
  components: { RoomImages, RoomDetails },
  data: () => ({
    hello: "world",
  }),
  methods: {
    // API Calls
  }
};
</script>

<style scoped></style>
