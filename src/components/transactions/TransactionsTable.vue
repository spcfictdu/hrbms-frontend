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
            {{ transactions.pagination.total }} TRANSACTIONS
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              rounded
              v-if="show && !$vuetify.breakpoint.xs"
              class="text-button mr-1"
              justify="space-around"
              @click="searchFunction"
              ><v-icon left>mdi-magnify</v-icon>Search</v-btn
            >
            <v-btn
              color="primary"
              icon
              v-if="show && $vuetify.breakpoint.xs"
              class="text-button"
              @click="searchFunction"
              ><v-icon>mdi-magnify</v-icon></v-btn
            >
            <v-btn
              :ripple="false"
              color="warning"
              v-if="show && !$vuetify.breakpoint.xs"
              @click="clearQuery"
              rounded
              ><v-icon left>mdi-cached</v-icon>Clear</v-btn
            >
            <v-btn
              :ripple="false"
              color="warning"
              v-if="show && $vuetify.breakpoint.xs"
              @click="clearQuery"
              icon
              ><v-icon left>mdi-cached</v-icon></v-btn
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
            <v-col :cols="colsTextfield">
              <span class="ml-2">First Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchFirstName"
              ></v-text-field>
            </v-col>
            <v-col :cols="colsTextfield">
              <span class="ml-2">Middle Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchMiddleName"
              ></v-text-field>
            </v-col>
            <v-col :cols="colsTextfield">
              <span class="ml-2">Last Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchLastName"
              ></v-text-field>
            </v-col>
            <v-col :cols="colsTextfield">
              <span class="ml-2">Reference</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchRefNum"
              ></v-text-field>
            </v-col>
            <v-col :cols="colsTextfield">
              <span class="ml-2">Check-in Date</span>
              <v-menu
                v-model="menuCheckIn"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="searchCheckIn"
                    v-on="on"
                    v-bind="attrs"
                    outlined
                    dense
                    readonly
                    hide-details="auto"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="searchCheckIn"
                  @input="menuCheckIn = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col :cols="colsTextfield">
              <span class="ml-2">Check-out Date</span>
              <v-menu
                v-model="menuCheckOut"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="searchCheckOut"
                    v-on="on"
                    v-bind="attrs"
                    outlined
                    dense
                    readonly
                    hide-details="auto"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="searchCheckOut"
                  @input="menuCheckOut = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="mappedTransactions"
            group-by="date"
            class="ma-5"
            @click:row="(v) => requestRouteEvent(v)"
            :footer-props="{
              itemsPerPage: [5, 10, 15],
            }"
            :server-items-length="transactions.pagination.total"
            :options.sync="options"
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
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "TransactionsTable",
  mixins: [TablePagination],
  props: {
    transactions: {
      required: true,
    },
  },
  data: () => ({
    searchFirstName: "",
    searchMiddleName: "",
    searchLastName: "",
    searchRefNum: "",
    searchCheckIn: "",
    searchCheckOut: "",
    menuCheckIn: false,
    menuCheckOut: false,
    title: "text-h4 font-weight-black mb-1",
    total_transactions: 0,
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
    requestRouteEvent: function (value) {
      const routeParams = {
        status: value.status,
        referenceNumber: value.reference,
      };
      this.$emit("route-event", routeParams);
    },
    searchFunction: function () {
      let triggerIndeterminate = false;

      if (this.searchFirstName) {
        this.query_params.firstName = this.searchFirstName;
        triggerIndeterminate = true;
      }
      if (this.searchMiddleName) {
        this.query_params.middleName = this.searchMiddleName;
        triggerIndeterminate = true;
      }
      if (this.searchLastName) {
        this.query_params.lastName = this.searchLastName;
        triggerIndeterminate = true;
      }
      if (this.searchRefNum) {
        this.query_params.referenceNumber = this.searchRefNum;
        triggerIndeterminate = true;
      }
      if (this.searchCheckIn) {
        this.query_params.checkInDate = this.searchCheckIn;
        triggerIndeterminate = true;
      }
      if (this.searchCheckOut) {
        this.query_params.checkOutDate = this.searchCheckOut;
        triggerIndeterminate = true;
      }

      console.log(triggerIndeterminate);

      if (triggerIndeterminate === true) {
        this.indeterminate = true;
        setTimeout(() => {
          this.indeterminate = false;
        }, 3000);
        this.value = 100;
      }

      this.$emit("query-params", this.query_params);
    },
    clearQuery: function () {
      let triggerIndeterminate = false;
      if (this.searchFirstName) {
        this.searchFirstName = "";
        delete this.query_params.firstName;
        triggerIndeterminate = true;
      }

      if (this.searchMiddleName) {
        this.searchMiddleName = "";
        delete this.query_params.middleName;
        triggerIndeterminate = true;
      }

      if (this.searchLastName) {
        this.searchLastName = "";
        delete this.query_params.lastName;
        triggerIndeterminate = true;
      }

      if (this.searchRefNum) {
        this.searchRefNum = "";
        delete this.query_params.referenceNumber;
        triggerIndeterminate = true;
      }
      if (this.searchCheckIn) {
        this.searchCheckIn = "";
        delete this.query_params.checkInDate;
        triggerIndeterminate = true;
      }
      if (this.searchCheckOut) {
        this.searchCheckOut = "";
        delete this.query_params.checkOutDate;
        triggerIndeterminate = true;
      }

      if (triggerIndeterminate === true) {
        this.indeterminate = true;
        setTimeout(() => {
          this.indeterminate = false;
        }, 3000);
        this.value = 100;
      }

      this.$emit("query-params", this.query_params);
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
    searchFirstName: {
      handler: function () {
        if (!this.searchFirstName || this.searchFirstName === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;

          delete this.query_params.firstName;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchMiddleName: {
      handler: function () {
        if (!this.searchMiddleName || this.searchMiddleName === "") {
          this.indeterminate = true;

          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;

          delete this.query_params.middleName;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchLastName: {
      handler: function () {
        if (!this.searchLastName || this.searchLastName === "") {
          this.indeterminate = true;

          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.lastName;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchRefNum: {
      handler: function () {
        if (!this.searchRefNum || this.searchRefNum === "") {
          this.indeterminate = true;

          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.referenceNumber;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchCheckIn: {
      handler: function () {
        if (!this.searchCheckIn || this.searchCheckIn === "") {
          this.indeterminate = true;

          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.checkInDate;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    searchCheckOut: {
      handler: function () {
        if (!this.searchCheckOut || this.searchCheckOut === "") {
          this.indeterminate = true;

          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.checkOutDate;
          this.$emit("query-params", this.query_params);
        }
      },
    },
    transactions: {
      immediate: true,
      handler(value) {
        if (value.data.length) {
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          this.total_transactions = value.pagination.total;
        } else {
          this.indeterminate = false;
          this.value = 0;
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
