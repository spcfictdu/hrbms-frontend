<template>
  <v-row>
    <v-col cols="12" md="6">
      <room-card :room="room.data"/>
    </v-col>
    <v-col cols="12" md="6">
      <div class="flex-container">
        <v-img
          v-for="(image, index) in room.image"
          :key="index"
          :src="image"
          :alt="`Card Section Two ${index + 1}`"
          class="image-container"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RoomCard from "./RoomCard.vue";
export default {
  name: "CardSectionTwo",
  props: { room: Object },
  components: { RoomCard },
  data: () => ({
  }),
};
</script>

<style scoped>
.flex-container {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  height: 100%;
  column-gap: 20px;
}

@media (max-width: 599px) {
  .flex-container {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
}

.image-container {
  max-width: 100%;
  min-height: 300px;
  border-radius: 10px;
}
</style>