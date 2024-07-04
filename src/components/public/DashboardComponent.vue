<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" v-if="rooms.isQuery">
          <room-type-buttons :withAllRooms="withAllRooms" @input-event="roomTypeEvent" />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12">
          <dashboard-content :rooms="rooms" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DashboardContent from "./dashboard/DashboardContent.vue";
import RoomTypeButtons from "@/components/buttons/RoomTypeButtons.vue";
export default {
  name: "DashboardComponent",
  components: { DashboardContent, RoomTypeButtons },
  props: { rooms: Object },
  data: () => ({
    withAllRooms: true,
  }),
  methods: {
    roomTypeEvent: function (payload) {
      let query = {
        roomType: payload,
      };
      this.$emit('input-event', query);
    }
  },
  computed: {},
};
</script>

<style scoped></style>
