<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="7">
        <v-img
          class="room-images"
          height="200"
          src="../../../assets/hotelRoom.png"
        />
      </v-col>
      <v-col cols="12" md="5">
        <v-img
          class="room-images"
          height="200"
          src="../../../assets/hotelRoom.png"
        />
      </v-col>
      <v-col cols="12" md="5">
        <v-img
          class="room-images"
          height="200"
          src="../../../assets/hotelRoom.png"
        />
      </v-col>
      <v-col cols="12" md="7">
        <v-img
          class="room-images"
          height="200"
          src="../../../assets/hotelRoom.png"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "RoomImages",
  data: () => ({}),
};
</script>

<style scoped>
.room-images {
  border-radius: 10px;
}
</style>
