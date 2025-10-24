<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader />

    <GuestListTable
      :loading="getLoading('guests')"
      class="mt-10"
      :guests="guests"
      @onQuery="fetch($event)"
    />
  </div>
</template>

<script>
import GuestListTable from "@/components/tables/variants/GuestListTable.vue";
import PageHeader from "@/components/headers/PageHeader.vue";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "GuestListView",
  components: { GuestListTable, PageHeader },
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
    ...mapGetters("guest", ["getLoading"]),
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
