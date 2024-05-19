<template>
  <div class="mt-10">
    <v-row>
      <v-col cols="12" md="5">
        <RoomImages />
      </v-col>
      <v-col cols="12" md="7">
        <RoomDetails />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomImages from "../../components/hotel-rooms/RoomImages.vue";
import RoomDetails from "../../components/hotel-rooms/RoomDetails.vue";

export default {
  name: "RoomDetailsView",
  components: { RoomImages, RoomDetails },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped></style>
