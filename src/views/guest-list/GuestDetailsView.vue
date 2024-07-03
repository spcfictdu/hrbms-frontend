<template>
  <div>
    <GuestDetails
      :guest="guest"
      @query-params="fetchGuestDetails"
      @delete-guest="deleteEvent"
      v-if="guest && guest.transactions"
    />
  </div>
</template>

<script>
import GuestDetails from "@/components/guests/GuestDetails.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "GuestDetailsView",
  components: { GuestDetails },
  data: () => ({}),
  computed: {
    ...mapState("guest", {
      guest: "guest",
    }),
  },
  methods: {
    ...mapActions("guest", ["fetchGuest", "deleteGuest"]),
    deleteEvent: function (guestID) {
      this.deleteGuest(guestID);
    },
    fetchGuestDetails: function (query_params) {
      const id = this.$route.params.id;
      this.fetchGuest({
        id: id,
        queryParams: query_params,
      });
    },
  },
  created() {
    this.fetchGuestDetails();
  },
};
</script>

<style scoped></style>
