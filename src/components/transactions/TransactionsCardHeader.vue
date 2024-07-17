<template>
  <div>
    <v-card-title class="text-subtitle-2 font-weight-black ml-3">
      {{ transactions.pagination.total }} TRANSACTIONS
      <v-spacer></v-spacer>
      <div v-if="show" class="d-flex">
        <div class="mr-2">
          <v-btn
            :ripple="false"
            color="warning"
            @click="clearQuery"
            rounded
            outlined
            class="d-none d-sm-flex"
            >Clear</v-btn
          >
          <v-btn
            :ripple="false"
            color="warning"
            class="d-flex d-sm-none"
            @click="clearQuery"
            icon
            ><v-icon left>mdi-cached</v-icon></v-btn
          >
        </div>

        <div>
          <v-btn
            color="primary"
            rounded
            class="d-none d-sm-flex"
            @click="searchFunction"
            ><v-icon left>mdi-magnify</v-icon>Search</v-btn
          >
          <v-btn
            color="primary"
            icon
            class="d-flex d-sm-none"
            @click="searchFunction"
            ><v-icon>mdi-magnify</v-icon></v-btn
          >
        </div>
      </div>

      <v-btn
        fab
        outlined
        @click="show = !show"
        :small="small"
        :x-small="xSmall"
        color="primary"
        class="ml-2"
      >
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-row>
      <v-col cols="12">
        <v-progress-linear
          color="amber"
          :indeterminate="indeterminate"
          :value="indeterminateValue"
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-if="show" class="mx-3 text-subtitle-2">
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">First Name</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.firstName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Middle Name</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.middleName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Last Name</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.lastName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Reference</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.referenceNumber"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
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
              v-model="query_params.checkInDate"
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
            v-model="query_params.checkInDate"
            @input="menuCheckIn = false"
          >
            <v-btn color="primary" block @click="clearDate('Check In')"
              >Clear</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="4">
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
              v-model="query_params.checkOutDate"
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
            v-model="query_params.checkOutDate"
            @input="menuCheckOut = false"
          >
            <v-btn color="primary" block @click="clearDate('Check Out')"
              >Clear</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "TrasactionsCardHeader",
  props: {
    transactions: {
      type: Object,
      required: true,
    },
  },
  mixins: [TablePagination],
  data: () => ({
    show: false,
    menuCheckIn: false,
    menuCheckOut: false,
    small: true,
    xSmall: false,
    indeterminate: true,
    indeterminateValue: 0,
  }),
  methods: {
    searchFunction: function () {
      if (Object.keys(this.query_params).length !== 0) {
        this.$emit("query-request", this.query_params);
        this.loadingAction();
      }
    },
    clearQuery: function () {
      let query = [
        "firstName",
        "middleName",
        "lastName",
        "referenceNumber",
        "checkInDate",
        "checkOutDate",
      ];

      if (Object.keys(this.query_params).length !== 0) {
        Object.keys(this.query_params).forEach((key) => {
          if (query.includes(key)) {
            this.$set(this.query_params, key, null)
            // delete this.query_params[key];
          }
        });
        this.$emit("query-request", this.query_params);
        this.loadingAction();
      }
    },
    loadingAction: function () {
      this.indeterminate = true;
      setTimeout(() => {
        this.indeterminate = false;
      }, 3000);
      this.indeterminateValue = 100;
    },
    clearDate: function (dateType) {
      if (dateType === "Check In") {
        this.query_params.checkInDate = "";
      } else {
        this.query_params.checkOutDate = "";
      }
    },
  },
  computed: {
    size() {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.small = false;
          this.xSmall = true;
        } else if (newVal.sm) {
          this.small = true;
          this.xSmall = false;
        } else {
          this.small = true;
          this.xSmall = false;
        }
      },
    },
    transactions: {
      immediate: true,
      handler(value) {
        if (value.data.length) {
          this.loadingAction();
        } else {
          this.indeterminate = false;
          this.indeterminateValue = 0;
        }
      },
    },
    query_params: {
      deep: true,
      handler: function (newVal) {
        let query = [
          "firstName",
          "middleName",
          "lastName",
          "referenceNumber",
          "checkInDate",
          "checkOutDate",
        ];

        Object.keys(newVal).forEach((key) => {
          if (query.includes(key)) {
            if (!newVal[key] || newVal[key] === "") {
              // delete newVal[key];
              this.$set(newVal, key, null)
            }
          }
        });
      },
    },
  },
};
</script>

<style scoped></style>
