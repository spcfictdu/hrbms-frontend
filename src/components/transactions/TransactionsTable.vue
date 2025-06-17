<template>
  <v-card flat>
    <TransactionsCardHeader
      :transactionsData="transactions"
      @onQuery="assignParams($event)"
    />
    <div class="pa-5">
      <PaginatedTable
        :headers="headers"
        :items="mappedTransactions"
        itemKey="reference"
        groupBy="date"
        @onQuery="assignParams($event)"
        @click:row="requestRouteEvent($event)"
        :footerProps="footerProps"
        :serverItemsLength="transactions.pagination.total"
        disableSort
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
      </PaginatedTable>
    </div>
  </v-card>
</template>

<script>
import TransactionsCardHeader from "./TransactionsCardHeader.vue";
import { format, parseISO } from "date-fns";
import { assignParams } from "@/mixins/FormattingFunctions";
import PaginatedTable from "../tables/PaginatedTable.vue";

export default {
  name: "TransactionsTable",
  mixins: [assignParams],
  components: { TransactionsCardHeader, PaginatedTable },
  props: {
    transactions: Object,
  },
  data: () => ({
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
    footerProps: {
      itemsPerPageOptions: [5, 10, 15],
    },
  }),
  methods: {
    requestRouteEvent: function (value) {
      const routeParams = {
        status: value.status,
        referenceNumber: value.reference,
      };
      this.$emit("route-event", routeParams);
    },
  },
  computed: {
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
    queryParams: {
      deep: true,
      handler: function (v) {
        this.$emit("onQuery", v);
      },
    },
  },
};
</script>

<style scoped></style>
