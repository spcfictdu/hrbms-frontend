<template>
  <v-container class="mt-lg-5">
    <v-row>
      <v-col cols="12"><div :class="title">Transactions</div></v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="mt-5">
          <v-card-title class="text-subtitle-2 font-weight-black ml-3">
            {{ transactions.length }} TRANSACTIONS
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              rounded
              v-if="show && !$vuetify.breakpoint.xs"
              class="text-button"
              justify="space-around"
              ><v-icon left>mdi-magnify</v-icon>Search</v-btn
            >
            <v-btn
              color="primary"
              icon
              v-if="show && $vuetify.breakpoint.xs"
              class="text-button"
              ><v-icon>mdi-magnify</v-icon></v-btn
            >
            <v-btn
              fab
              outlined
              @click="show = !show"
              :small="small"
              :x-small="xSmall"
              color="primary"
              class="ml-2"
            >
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>
          <v-row>
            <v-col cols="12">
              <v-progress-linear
                color="amber"
                :indeterminate="indeterminate"
                :value="value"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row v-if="show" class="mx-3 text-subtitle-2">
            <v-col
              :cols="colsTextfield"
              v-for="(header, index) in textfieldHeaders"
              :key="index"
            >
              <span class="ml-2">{{ header }}</span>
              <v-text-field outlined dense hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="mappedTransactions"
            group-by="date"
            class="ma-5"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { format, parseISO } from "date-fns";
import { mapActions, mapState } from "vuex";

export default {
  name: "TransactionsTable",
  data: () => ({
    title: "text-h4 font-weight-black mb-1",
    show: false,
    indeterminate: true,
    value: 0,
    small: true,
    xSmall: false,
    colsTextfield: 4,
    headers: [
      {
        text: "Name",
        value: "name",
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
    textfieldHeaders: [
      "First Name",
      "Middle Name",
      "Last Name",
      "Reference",
      "Check-in Date",
      "Check-out Date",
    ],
    statusColors: {
      "checked-in": "checkedin",
      "checked-out": "checkedout",
      reserved: "reserved",
      confirmed: "confirmed",
    },
  }),
  methods: {
    ...mapActions("transaction", ["fetchTransactions"]),
  },
  computed: {
    ...mapState("transaction", {
      transactions: "transactions",
    }),
    size() {
      return this.$vuetify.breakpoint;
    },
    mappedTransactions() {
      return this.transactions
        ? this.transactions.map((item) => ({
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
  created() {
    this.fetchTransactions();
  },
  watch: {
    transactions: {
      immediate: true,
      handler(value) {
        if (value.length) {
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
        } else {
          this.indeterminate = false;
        }
      },
    },
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.title = "d-flex text-h6 font-weight-bold justify-center mt-n3";
          this.small = false;
          this.xSmall = true;
          this.colsTextfield = 12;
        } else if (newVal.sm) {
          this.title = "text-h6 font-weight-bold mb-1";
          this.small = true;
          this.xSmall = false;
          this.colsTextfield = 6;
        } else {
          this.title = "text-h5 font-weight-bold mb-1";
          this.small = true;
          this.xSmall = false;
          this.colsTextfield = 4;
        }
      },
    },
  },
};
</script>

<style scoped></style>
