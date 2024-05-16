<template>
  <div>
    <booking-form />
  </div>
</template>

<script>
import BookingForm from "@/components/hotel-rooms/availability/BookingForm.vue";
export default {
  name: "BookingView",
  data: () => ({}),
  components: {
    BookingForm,
  },
};
</script>

<style scoped></style>
