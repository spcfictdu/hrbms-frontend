<template>
  <v-row dense>
    <v-col cols="12" md="8">
      <v-img class="room-images" max-height="400" :src="imagePath(images[0])" />
    </v-col>
    <v-col cols="12" md="4" class="grid-container">
      <img class="room-images grid-images" :src="imagePath(images[1])" />
      <img class="room-images grid-images" :src="imagePath(images[2])" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "RoomImagesTwo",
  props: ["images"],
  data: () => ({}),
  methods: {
    imagePath: function (path) {
      return `${this.$apiPath}/${path}`;
    },
  },
  computed: {},
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-rows: 1fr;
  row-gap: 8px;
}

@media (max-width: 959px) {
  .grid-container {
    grid-template-columns: 1fr 1fr;
    column-gap: 8px;
  }
}

.room-images {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.grid-images {
  height: 196px;
  max-height: 196px;
}
</style>
