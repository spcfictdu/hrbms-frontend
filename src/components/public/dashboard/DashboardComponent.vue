<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" v-if="!roomSearchQuery">
          <room-type-buttons />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12">
          <dashboard-content />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DashboardContent from './DashboardContent.vue';
import RoomTypeButtons from '@/components/hotel-rooms/RoomTypeButtons.vue';
  export default {
    name: "DashboardComponent",
    components: { DashboardContent, RoomTypeButtons },
    computed: {
      roomSearchQuery: function () {
        return JSON.stringify(this.$route.query) === "{}";
      }
    }
  }
</script>

<style scoped>

</style>