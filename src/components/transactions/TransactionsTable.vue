<template>
  <v-card flat>
    <transactions-card-header
      :transactions="transactions"
      @query-request="searchFunction"
    />
    <v-data-table
      :headers="headers"
      :items="mappedTransactions"
      item-key="reference"
      group-by="date"
      class="ma-5"
      @click:row="(v) => requestRouteEvent(v)"
      :footer-props="{
        itemsPerPage: [5, 10, 15],
      }"
      :server-items-length="transactions.pagination.total"
      :options.sync="options"
      disable-sort
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :color="statusColors[item.status.toLowerCase()]"
          dark
          small
          class="text-overline"
          >{{ item.status }}</v-chip
        >
      </template>
      <template v-slot:[`group.header`]="{ group }">
        <td :colspan="headers.length" class="pl-8">
          {{ group }}
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import TransactionsCardHeader from "./TransactionsCardHeader.vue";
import { format, parseISO } from "date-fns";
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "TransactionsTable",
  mixins: [TablePagination],
  components: { TransactionsCardHeader },
  props: {
    transactions: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    title: "",
    headers: [
      {
        text: "Name",
        value: "name",
        width: "180px",
      },
      {
        text: "Status",
        value: "status",
      },
      {
        text: "Reference",
        value: "reference",
      },
      {
        text: "Occupants",
        value: "occupants",
      },
      {
        text: "Check-in",
        value: "checkIn",
      },
      {
        text: "Check-out",
        value: "checkOut",
      },
      {
        text: "Booked",
        value: "booked",
      },
      {
        text: "Room",
        value: "room",
      },
      {
        text: "Total",
        value: "total",
      },
    ],
    statusColors: {
      "checked-in": "checkedin",
      "checked-out": "checkedout",
      reserved: "reserved",
      confirmed: "confirmed",
    },
    transactionList: [],
  }),
  methods: {
    requestRouteEvent: function (value) {
      const routeParams = {
        status: value.status,
        referenceNumber: value.reference,
      };
      this.$emit("route-event", routeParams);
    },
    searchFunction: function (query_params) {
      if (this.query_params.perPage) {
        query_params.perPage = this.query_params.perPage;
      }

      if (this.query_params.page) {
        delete this.query_params.page;
      }

      this.assignParams(query_params);
    },
  },
  computed: {
    size() {
      return this.$vuetify.breakpoint;
    },
    mappedTransactions() {
      return this.transactions
        ? this.transactions.data.map((item) => ({
            name: item.fullName,
            status: item.status,
            reference: item.transactionRefNum,
            occupants: item.occupants,
            date: format(parseISO(item.booked), "MMMM dd, yyyy"),
            checkIn: item.checkInDate,
            checkOut: item.checkOutDate,
            booked: item.booked,
            room: item.room,
            total: item.total,
          }))
        : [];
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.title = "d-flex text-h6 font-weight-bold justify-center mt-n3";
        } else if (newVal.sm) {
          this.title = "text-h6 font-weight-bold mb-1";
        } else {
          this.title = "text-h5 font-weight-bold mb-1";
        }
      },
    },
  },
};
</script>

<style scoped></style>
