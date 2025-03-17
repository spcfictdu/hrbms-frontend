<template>
  <div>
    <GuestInfo :guest="guest" class="mb-5" />

    <v-card flat>
      <GuestTableHeader :guest="guest" @onQuery="searchQuery" />

      <PaginatedTable
        :headers="headers"
        :items="guestTransactions"
        :footerProps="footerProps"
        itemKey="reference"
        disableSort
        @click:row="pushToTransactionRoute"
      />
      <v-data-table
        :headers="headers"
        :items="guestTransactions"
        class="ma-5"
        item-key="reference"
        :footer-props="{
          itemsPerPage: [5, 10, 15],
        }"
        @click:row="(v) => pushToTransactionRoute(v)"
        :options.sync="options"
        disable-sort
      >
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="statusColors[item.status.toLowerCase()]"
            dark
            small
            class="text-overline"
          >
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import GuestTableHeader from "../table-headers/GuestTableHeader.vue";
import PaginatedTable from "../tables/PaginatedTable.vue";
import GuestInfo from "./GuestInfo.vue";
import { format, parseISO } from "date-fns";
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "GuestDetails",
  components: { GuestInfo, GuestTableHeader, PaginatedTable },
  mixins: [TablePagination],
  props: {
    guest: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: "Status", value: "status" },
      { text: "Reference", value: "reference" },
      { text: "Occupants", value: "ocupants" },
      { text: "Check-in", value: "checkIn" },
      { text: "Check-out", value: "checkOut" },
      { text: "Booked", value: "booked" },
      { text: "Room", value: "room" },
      { text: "Total", value: "total" },
    ],
    statusColors: {
      "checked-in": "checkedin",
      "checked-out": "checkedout",
      reserved: "reserved",
      confirmed: "confirmed",
    },
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
    footerProps: {
      itemsPerPage: [5, 10, 15],
    },
  }),
  methods: {
    pushToTransactionRoute: function (value) {
      let payload = {
        status: value.status,
        referenceNumber: value.reference,
      };
      if (this.confirmationRoute.includes(payload.status)) {
        this.$router.push({
          name: "Confirmation",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      } else if (this.checkInCheckOutRoute.includes(payload.status)) {
        this.$router.push({
          name: "CheckInOut",
          params: {
            referenceNumber: payload.referenceNumber,
          },
        });
      }
    },
    searchQuery: function (query_params) {
      if (this.query_params.perPage) {
        query_params.perPage = this.query_params.perPage;
      }

      if (this.query_params.page) {
        delete this.query_params.page;
      }

      this.assignParams(query_params);
    },
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  computed: {
    guestTransactions: function () {
      return Array.isArray(this.guest.transactions)
        ? this.guest.transactions.map((content) => ({
            status: content.status,
            reference: content.reference,
            ocupants: content.ocupants,
            checkIn: content.checkIn,
            checkOut: content.checkOut,
            booked: format(parseISO(content.booked), "yyyy-MM-dd"),
            room: "Room " + content.room,
            total: content.total,
          }))
        : Object.keys(this.guest.transactions).map((content) => ({
            status: this.guest.transactions[content]["status"],
            reference: this.guest.transactions[content]["reference"],
            ocupants: this.guest.transactions[content]["ocupants"],
            checkIn: this.guest.transactions[content]["checkIn"],
            checkOut: this.guest.transactions[content]["checkOut"],
            booked: format(
              parseISO(this.guest.transactions[content]["booked"]),
              "yyyy-MM-dd"
            ),
            room: "Room " + this.guest.transactions[content]["room"],
            total: this.guest.transactions[content]["total"],
          }));
    },
  },
  watch: {},
};
</script>

<style scoped></style>
