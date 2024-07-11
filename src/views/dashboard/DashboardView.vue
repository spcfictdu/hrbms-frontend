<template>
  <div class="mt-10">
    <calendar-component
      @calendar-event="requestCalendar"
      :calendarData="calendar"
      @route-event="pushToTransactionRoute"
      :meta="meta"
    />
  </div>
</template>

<script>
import CalendarComponent from "../../components/hotel-rooms/forms/CalendarComponent.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "DashboardView",
  components: {
    CalendarComponent,
  },
  data: () => ({
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
  }),
  methods: {
    ...mapActions("availabilityCalendar", ["fetchAvailabilityCalendar", "triggerLoading"]),
    requestCalendar: function (queryParams) {
      this.triggerLoading(true).then(() => {
        this.fetchAvailabilityCalendar(queryParams);
      })

    },
    pushToTransactionRoute: function (payload) {
      if (this.confirmationRoute.includes(payload.status)) {
        this.$router.push({
          name: "Confirmation",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      } else if (this.checkInCheckOutRoute.includes(payload.status)) {
        this.$router.push({
          name: "CheckInOut",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      }
    },
  },
  computed: {
    ...mapState("availabilityCalendar", {
      calendar: "calendar",
      meta: "meta",
    }),
  },
};
</script>

<style scoped></style>
