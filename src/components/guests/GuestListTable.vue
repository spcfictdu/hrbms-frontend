<template>
  <v-card flat>
    <guest-list-card-header-vue
      :guests="guests"
      @query-request="searchFunction"
    />
    <!-- Guest List -->
    <v-data-table
      @click:row="selectGuest"
      :headers="headers"
      :items="guests.guests"
      class="ma-5"
      :footer-props="{
        itemsPerPage: [5, 10, 15],
      }"
      :options.sync="options"
      :server-items-length="guests.pagination.total"
      disable-sort
    >
    </v-data-table>
  </v-card>
</template>

<script>
import TablePagination from "@/mixins/TablePagination";
import GuestListCardHeaderVue from "./GuestListCardHeader.vue";
export default {
  name: "GuestListTable",
  components: { GuestListCardHeaderVue },
  mixins: [TablePagination],
  props: {
    guests: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      {
        text: "Name",
        value: "fullName",
      },
      {
        text: "Booking Reference",
        value: "referenceNumber",
      },
      {
        text: "Email",
        value: "email",
      },
      {
        text: "Phone",
        value: "phone",
      },
    ],
    guestClass: "text-h5 font-weight-black mb-1",
    errors: {},
  }),
  methods: {
    searchFunction: function (query_params) {
      if (this.query_params.perPage) {
        query_params.perPage = this.query_params.perPage;
      }

      if (this.query_params.page) {
        delete this.query_params.page;
      }

      this.assignParams(query_params);
    },
    selectGuest: function (row) {
      this.$router.push({
        name: "guest",
        params: { id: row.id },
      });
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.guestClass =
            "d-flex text-h6 font-weight-bold justify-center mt-n3";
        } else if (newVal.sm) {
          this.guestClass = "text-h6 font-weight-bold mb-1";
        } else {
          this.guestClass = "text-h5 font-weight-bold mb-1";
        }
      },
    },
  },
};
</script>

<style scoped></style>
