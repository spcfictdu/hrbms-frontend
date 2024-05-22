<template>
  <div class="mt-10">
    <booking-form :queryResult="queryResult"/>
  </div>
</template>

<script>
import BookingForm from "../../../components/hotel-rooms/availability/BookingForm.vue"
import HotelRoomsHeader from "@/components/headers/HotelRoomsHeader.vue";
export default {
  name: "BookingView",
  data: () => ({}),
  components: {
    BookingForm,
    HotelRoomsHeader,
  },
  computed: {
    queryResult() {
      let query = this.$route.query.room;
      let format = JSON.parse(query)
      return format;
    }
  }
};
</script>

<style scoped></style>
