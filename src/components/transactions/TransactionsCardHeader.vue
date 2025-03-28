<template>
  <TableFilter
    :numberOfItems="transactions.pagination.total"
    item="TRANSACTIONS"
    :searchFn="searchFunction"
    :clearFn="clearQuery"
    :loaded="hasData"
  >
    <v-col cols="12" sm="6" md="4">
      <span class="text-caption ml-2">First Name</span>
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="query_params.firstName"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <span class="text-caption ml-2">Middle Name</span>
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="query_params.middleName"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <span class="text-caption ml-2">Last Name</span>
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="query_params.lastName"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <span class="text-caption ml-2">Reference</span>
      <v-text-field
        outlined
        dense
        hide-details="auto"
        v-model="query_params.referenceNumber"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <span class="text-caption ml-2">Check-in Date</span>
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
      <span class="text-caption ml-2">Check-out Date</span>
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
  </TableFilter>
</template>

<script>
import TableFilter from "../table-headers/TableFilter.vue";
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "TrasactionsCardHeader",
  components: { TableFilter },
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
    hasData() {
      return !!this.transactions ?? false;
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
