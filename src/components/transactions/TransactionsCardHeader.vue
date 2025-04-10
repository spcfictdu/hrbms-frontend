<template>
  <TableFilter
    :numberOfItems="transactions.pagination.total"
    item="TRANSACTIONS"
    :searchFn="handleSearch"
    :clearFn="handleClear"
    :loaded="hasData"
  >
    <v-col cols="12" sm="6" md="4">
      <FormField label="First Name">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.firstName"
        ></v-text-field>
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Middle Name">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.middleName"
        ></v-text-field>
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Last Name">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.lastName"
        ></v-text-field>
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Reference">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.referenceNumber"
        ></v-text-field>
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Check-in Date">
        <DateField
          :model="queryParams.checkInDate"
          @input="evaluateValue('checkInDate', $event)"
        >
          <v-btn
            color="primary"
            block
            @click="evaluateValue('checkInDate', null)"
            >Clear</v-btn
          >
        </DateField>
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Check-out Date">
        <DateField
          :model="queryParams.checkOutDate"
          @input="evaluateValue('checkOutDate', $event)"
        >
          <v-btn
            color="primary"
            block
            @click="evaluateValue('checkOutDate', null)"
            >Clear</v-btn
          >
        </DateField>
      </FormField>
    </v-col>
  </TableFilter>
</template>

<script>
import TableFilter from "../table-headers/TableFilter.vue";
import TablePagination from "@/mixins/TablePagination";
import FormField from "../fields/FormField.vue";
import DateField from "../fields/DateField.vue";

export default {
  name: "TrasactionsCardHeader",
  components: { TableFilter, FormField, DateField },
  props: {
    transactions: {
      type: Object,
      required: true,
    },
  },
  mixins: [TablePagination],
  data: () => ({
    queryParams: {
      firstName: null,
      middleName: null,
      lastName: null,
      referenceNumber: null,
      checkInDate: null,
      checkOutDate: null,
    },
    show: false,
    menuCheckIn: false,
    menuCheckOut: false,
    small: true,
    xSmall: false,
    indeterminate: true,
    indeterminateValue: 0,
  }),
  methods: {
    handleSearch() {
      this.$emit("query-request", this.queryParams);
    },
    searchFunction: function () {
      if (Object.keys(this.query_params).length !== 0) {
        this.$emit("query-request", this.query_params);
        this.loadingAction();
      }
    },
    handleClear() {
      Object.keys(this.queryParams).forEach((key) => {
        this.$set(this.queryParams, key, null);
      });

      this.handleSearch()
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
    evaluateValue(key, value) {
      this.queryParams[key] = value;
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
