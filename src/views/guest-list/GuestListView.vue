<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />
    <RouteLoader :target="hasData" class="mt-10">
      <GuestListTable :guests="guests" @onQuery="fetch($event)" />
    </RouteLoader>
  </div>
</template>

<script>
import GuestListTable from "@/components/tables/variants/GuestListTable.vue";
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
    ...mapState("guest", ["guests"]),
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
