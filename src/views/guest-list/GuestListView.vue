<template>
  <div
    :class="{
      'xl-padding mt-n3': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3':
        $vuetify.breakpoint.lgAndDown,
    }"
  >
    <v-alert :value="showAlert" :type="AlertType" class="w-full" transition="scroll-y-transition">
      {{ alertProperties.message }}
    </v-alert>
    <GuestListTable
      :guests="guests"
      @query_params="paginationGuestTable"
      v-if="guests && guests.pagination"
    />
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
