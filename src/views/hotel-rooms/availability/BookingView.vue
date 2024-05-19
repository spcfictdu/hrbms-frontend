<template>
  <div class="mt-10">
    <booking-form />
  </div>
</template>

<script>
import BookingForm from "@/components/hotel-rooms/Availability/BookingForm.vue";
import HotelRoomsHeader from "@/components/headers/HotelRoomsHeader.vue";
export default {
  name: "BookingView",
  data: () => ({}),
  components: {
    BookingForm,
    HotelRoomsHeader,
  },
};
</script>

<style scoped></style>
