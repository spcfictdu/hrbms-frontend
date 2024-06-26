<template>
  <div>
    <GuestDetails :guest="guest" @delete-event="deleteEvent" />
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
    fetchGuestDetails: function () {
      const id = this.$route.params.id;
      this.fetchGuest(id)
    },
  },
  created() {
    this.fetchGuestDetails();
  },
};
</script>

<style scoped></style>
