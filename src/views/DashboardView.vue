<template>
  <div>
    <v-container fluid>
      <CalendarComponent />
    </v-container>
  </div>
</template>

<script>
import CalendarComponent from "../components/CalendarComponent.vue";
export default {
  name: "DashboardView",
  components: {
    CalendarComponent,
  },
};
</script>

<style scoped></style>
