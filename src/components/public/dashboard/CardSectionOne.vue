<template>
  <v-row>
    <v-col cols="6">
      <v-img :src="sampleImage" alt="Card Image 1" class="image-container"></v-img>
    </v-col>
    <v-col cols="6">
      <room-card />
    </v-col>
  </v-row>
</template>

<script>
import RoomCard from './RoomCard.vue';
export default {
  name: "CardVariationOne",
  components: { RoomCard },
  data: () => ({
    sampleImage: require("../../../assets/bgImage-5.png"),
  }),
};
</script>

<style scoped>

.image-container {
  max-width: 100%;
  min-height: 300px;
  border-radius: 10px;
  height: 100%;
}

</style>
