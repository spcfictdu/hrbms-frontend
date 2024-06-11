<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="7">
        <v-img class="room-images" height="200" :src="imagePath(images[0])" />
      </v-col>
      <v-col cols="12" md="5">
        <v-img class="room-images" height="200" :src="imagePath(images[1])" />
      </v-col>
      <v-col cols="12" md="5">
        <v-img class="room-images" height="200" :src="imagePath(images[2])" />
      </v-col>
      <v-col cols="12" md="7">
        <v-img class="room-images" height="200" :src="imagePath(images[3])" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "RoomImages",
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
.room-images {
  border-radius: 10px;
}
</style>
