<template>
  <div>
    <GuestDetails
      :guest="guest"
      @query_params="fetchGuestDetails"
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
    ...mapActions("guest", ["fetchGuest"]),
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
