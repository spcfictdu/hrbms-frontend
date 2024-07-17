<template>
  <v-container>
    <div
      :class="{
        'xl-padding mt-n6': $vuetify.breakpoint.xl,
        'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n6':
          $vuetify.breakpoint.lgAndDown,
      }"
    >
      <v-row v-if="!$vuetify.breakpoint.xs">
        <v-col cols="12">
          <div class="text-h5 text-sm-h6 font-weight-bold mb-1">
            Guest Details
          </div>
        </v-col>
      </v-row>
      <v-divider v-if="!$vuetify.breakpoint.xs" class="my-3" />
      <GuestInfo
        :guest="guest"
        @delete-request="passDeleteRequest"
        class="mb-5"
      />
      <v-row>
        <v-col cols="12">
          <v-card elevation="0">
            <GuestCardHeader :guest="guest" @search-query="searchQuery" />
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
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import GuestCardHeader from "./GuestCardHeader.vue";
import GuestInfo from "./GuestInfo.vue";
import { format, parseISO } from "date-fns";
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "GuestDetails",
  components: { GuestInfo, GuestCardHeader },
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
    title: "",
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
  }),
  methods: {
    passDeleteRequest: function (guestID) {
      this.$emit("delete-guest", guestID);
    },
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

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
