<template>
  <v-card flat>
    <GuestTableHeader :guest="guest" @onQuery="assignParams($event)" />

    <div class="pa-5">
      <DefaultTable
        :headers="headers"
        :items="tableData"
        :footerProps="footerProps"
        itemKey="reference"
        disableSort
        @click:row="pushToTransactionRoute"
      >
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="statusProps[item.status].color"
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
</template>

<script>
import GuestTableHeader from "@/components/table-headers/GuestTableHeader.vue";
import DefaultTable from "@/components/tables/DefaultTable.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
import { format, parseISO } from "date-fns";
export default {
  name: "GuestTransactionsTable",
  mixins: [assignParams],
  components: { GuestTableHeader, DefaultTable },
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
    statusProps: {
      RESERVED: {
        color: "reserved",
        route: "Confirmation",
      },
      CONFIRMED: {
        color: "confirmed",
        route: "CheckInOut",
      },
      "CHECKED-IN": {
        color: "checkedin",
        route: "CheckInOut",
      },
      "CHECKED-OUT": {
        color: "checkedout",
        route: "CheckInOut",
      },
    },
    footerProps: {
      itemsPerPage: [5, 10, 15],
    },
  }),
  methods: {
    pushToTransactionRoute: function (value) {
      this.$router.push({
        name: this.statusProps[value.status].route,
        params: {
          referenceNumber: value.reference,
        },
      });
    },
  },
  computed: {
    tableData: function () {
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
        : [];
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
