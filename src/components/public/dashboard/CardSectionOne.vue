<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-img :src="room.image" alt="Image 2" class="image-container"></v-img>
    </v-col>
    <v-col cols="12" md="6" order="first" order-md="last">
      <room-card :room="room.data"/>
    </v-col>
  </v-row>
</template>

<script>
import RoomCard from './RoomCard.vue';
export default {
  name: "CardVariationOne",
  props: { room: Object },
  components: { RoomCard },
  data: () => ({
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
