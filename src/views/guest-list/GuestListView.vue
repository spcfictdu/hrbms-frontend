<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <v-alert
      :value="showAlert"
      :type="AlertType"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ alertProperties.message }}
    </v-alert>
    <PageHeader />
    <GuestListTable
      class="mt-10"
      :guests="guests"
      @query_params="paginationGuestTable"
      v-if="guests && guests.pagination"
    />
  </div>
</template>

<script>
import GuestListTable from "@/components/guests/GuestListTable.vue";
import PageHeader from "@/components/headers/PageHeader.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "GuestListView",
  components: { GuestListTable, PageHeader },
  data: () => ({
    showAlert: false,
    AlertType: null,
  }),
  methods: {
    ...mapActions("guest", ["fetchGuests"]),
    paginationGuestTable: function (query_params) {
      this.fetchGuests(query_params);
    },
    triggerAlert: function (value) {
      this.showAlert = value;
    },
  },
  computed: {
    ...mapState("guest", {
      guests: "guests",
      alertProperties: "alertProperties",
    }),
  },
  created() {
    this.fetchGuests();
  },
  watch: {
    alertProperties: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.type !== "") {
          this.triggerAlert(true);
          this.AlertType = newVal.type;
          setTimeout(() => {
            this.triggerAlert(false);
            this.AlertType = null;
            newVal.message = "";
            newVal.type = "";
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
