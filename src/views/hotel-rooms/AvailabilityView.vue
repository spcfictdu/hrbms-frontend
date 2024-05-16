<template>
  <div>
    <calendar-component />
  </div>
</template>

<script>
import CalendarComponent from "@/components/hotel-rooms/Availability/CalendarComponent.vue";
export default {
  name: "AvailabilityView",
  components: {
    CalendarComponent,
  },
};
</script>

<style scoped></style>
