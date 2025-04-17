<template>
  <TableFilter
    :numberOfItems="transactionsData.pagination.total"
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
import FormField from "../fields/FormField.vue";
import DateField from "../fields/DateField.vue";

export default {
  name: "TrasactionsCardHeader",
  components: { TableFilter, FormField, DateField },
  props: {
    transactionsData: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    queryParams: {
      firstName: null,
      middleName: null,
      lastName: null,
      referenceNumber: null,
      checkInDate: null,
      checkOutDate: null,
    },
  }),
  methods: {
    handleSearch() {
      this.$emit("onQuery", this.queryParams);
    },
    handleClear() {
      Object.keys(this.queryParams).forEach((key) => {
        this.$set(this.queryParams, key, null);
      });

      this.handleSearch()
    },
    evaluateValue(key, value) {
      this.queryParams[key] = value;
    },
  },
  computed: {
    hasData() {
      return !!this.transactionsData ?? false;
    },
  },
};
</script>

<style scoped></style>
