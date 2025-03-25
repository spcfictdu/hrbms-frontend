<template>
  <div>
    <GuestInfo :guest="guest" class="mb-5" />

    <v-card flat>
      <GuestTableHeader :guest="guest" @onQuery="assignParams($event)" />

      <div class="pa-5">
        <DefaultTable
          :headers="headers"
          :items="guestTransactions"
          :footerProps="footerProps"
          itemKey="reference"
          disableSort
          @click:row="pushToTransactionRoute"
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
        </DefaultTable>
      </div>
    </v-card>
  </div>
</template>

<script>
import GuestTableHeader from "../table-headers/GuestTableHeader.vue";
import DefaultTable from "../tables/DefaultTable.vue";
import GuestInfo from "./GuestInfo.vue";
import { format, parseISO } from "date-fns";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "GuestDetails",
  components: { GuestInfo, GuestTableHeader, DefaultTable },
  mixins: [assignParams],
  props: {
    guest: Object,
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
    redirectRoutes: {
      RESERVED: "Confirmation",
      CONFIRMED: "CheckInOut",
      "CHECKED-IN": "CheckInOut",
      "CHECKED-OUT": "CheckInOut",
    },
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
    footerProps: {
      itemsPerPage: [5, 10, 15],
    },
  }),
  methods: {
    pushToTransactionRoute: function (value) {
      this.$router.push({
        name: this.redirectRoutes[value.status],
        params: {
          referenceNumber: value.referenceNumber,
        },
      });
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
  watch: {
    queryParams: {
      deep: true,
      handler: function (v) {
        console.log(v);
        this.$emit("onQuery", v);
      },
    },
  },
};
</script>

<style scoped></style>
