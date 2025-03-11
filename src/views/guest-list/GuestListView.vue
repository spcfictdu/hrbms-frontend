<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />
    <RouteLoader :target="hasData" class="mt-10">
      <GuestListTable :guests="guests" @query_params="paginationGuestTable" />
    </RouteLoader>
  </div>
</template>

<script>
import GuestListTable from "@/components/guests/GuestListTable.vue";
import PageHeader from "@/components/headers/PageHeader.vue";
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestListView",
  components: { GuestListTable, PageHeader, RouteLoader },
  data: () => ({}),
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("guest", ["fetchGuests"]),
    fetch: function (query_params = {}) {
      this.fetchGuests(query_params);
    },
  },
  computed: {
    ...mapState("guest", {
      guests: "guests",
      alertProperties: "alertProperties",
    }),
    hasData: function () {
      return !!this.guests ?? false;
    },
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
