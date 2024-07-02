<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- Room Buttons -->
        </v-col>

        <!-- Main Content -->
        <v-col>
          <dashboard-content />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DashboardContent from './DashboardContent.vue'
  export default {
    name: "DashboardComponent",
    components: { DashboardContent }
  }
</script>

<style scoped>

</style>