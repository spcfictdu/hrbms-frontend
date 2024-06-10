<template>
  <div>
    <v-card flat>
      <v-card-title class="text-subtitle-1">
        <div class="w-full d-flex justify-space-between align-center">
          <div
            class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center"
          >
            <div
              class="text-body-1 text-uppercase font-weight-bold mr-0 mr-sm-5"
            >
              {{ room.name }}
            </div>
            <div class="d-none d-sm-block mr-0 mx-sm-5">{{ room.floor }}</div>
            <div class="text-caption text-sm-subtitle-1 mx-0 mx-sm-5">
              Guest: {{ room.guest }}
            </div>
          </div>
          <div class="d-flex justify-space-between align-center">
            <v-chip
              class="mr-4 text-uppercase font-weight-bold white--text"
              :color="chipColor(room.status)"
              >{{ room.status }}</v-chip
            >
            <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
            <!-- Add Menu here -->
          </div>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "RoomListCard",
  props: {
    room: Object,
  },
  data: () => ({}),
  methods: {
    chipColor: function (status) {
      const value = status.toLowerCase();
      let color = null;
      switch (value) {
        case "occupied":
          color = "occupied";
          break;
        case "reserved":
          color = "reserved";
          break;
        case "available":
          color = "available";
          break;
        case "unclean":
          color = "unclean";
          break;
        case "confirmed":
          color = "confirmed";
          break;
        default:
          color = "primary";
      }
      return color;
    },
  },
};
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
