<template>
  <div class="mt-10">
    <booking-form
      @validation-event="requestPostTransaction"
      :queryResult="queryResult"
    />
  </div>
</template>

<script>
import BookingForm from "@/components/hotel-rooms/forms/BookingForm.vue";
export default {
  name: "GuestBookingView",
  components: { BookingForm },
  data: () => ({}),
  methods: {
    requestPostTransaction: function () {

    }
  },
  computed: {
    queryResult() {
      return this.$route.query;
    },
  },
};
</script>

<style scoped></style>
