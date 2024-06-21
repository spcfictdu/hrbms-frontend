<template>
  <div>
    <v-row>
      <v-col
        cols="3"
        v-for="(roomCount, index) in roomStatus.roomStatusCount"
        :key="index"
      >
        <v-btn
          block
          depressed

          ><div class="font-weight-bold text-h6">{{ roomCount }}</div></v-btn
        >
      </v-col>
    </v-row>

    <v-divider />
  </div>
</template>

<script>
export default {
  name: "OccupiedRoomsComponent",
  props: {
    roomStatus: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
  watch: {},
};
</script>

<style scoped></style>
