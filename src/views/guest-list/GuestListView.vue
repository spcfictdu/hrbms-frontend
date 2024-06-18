<template>
  <div
    :class="{
      'xl-padding mt-n3': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3':
        $vuetify.breakpoint.lgAndDown,
    }"
    v-if="guests"
  >
    <v-alert
    :value="showAlert"
    >
    </v-alert>
    <GuestListTable :guests="guests" @query_params="paginationGuestTable" />
  </div>
</template>

<script>
import GuestListTable from "@/components/guests/GuestListTable.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestListView",
  components: { GuestListTable },
  data: () => ({
    showAlert: false,
  }),
  methods: {
    ...mapActions("guest", ["fetchGuests"]),
    paginationGuestTable: function (queryParams) {
      this.fetchGuests(queryParams);
    },
  },
  computed: {
    ...mapState("guest", {
      guests: "guests",
    }),
  },
  created() {
    this.fetchGuests();
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
