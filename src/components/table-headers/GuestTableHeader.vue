<template>
  <TableFilter
    :numberOfItems="itemsLength"
    :item="headerTitle"
    :searchFn="handleSearch"
    :clearFn="handleClear"
    :loaded="hasData"
  >
    <v-col cols="12" sm="4">
      <FormField label="Reference">
        <v-text-field
          dense
          outlined
          hide-details="auto"
          v-model="queryParams.referenceNumber"
        />
      </FormField>
    </v-col>
    <v-col cols="12" sm="4">
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
          ></DateField
        >
      </FormField>
    </v-col>
    <v-col cols="12" sm="4">
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
          ></DateField
        >
      </FormField>
    </v-col>
  </TableFilter>
</template>

<script>
import TableFilter from "./TableFilter.vue";
import DateField from "../fields/DateField.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "GuestTableHeader",
  components: { TableFilter, DateField, FormField },
  props: {
    guest: Object,
  },
  data: () => ({
    queryParams: {
      referenceNumber: null,
      checkInDate: null,
      checkOutDate: null,
    },
  }),
  methods: {
    handleSearch: function () {
      this.$emit("onQuery", this.queryParams);
    },
    handleClear: function () {
      Object.keys(this.queryParams).forEach((key) => {
        this.$set(this.queryParams, key, null);
      });

      this.$emit("search-query", this.query_params);
    },
    evaluateValue: function (key, value) {
      this.queryParams[key] = value;
    },
  },
  computed: {
    itemsLength: function () {
      return this.guest.transactions.length;
    },
    headerTitle: function () {
      const titles = {
        0: "NO ITEMS FOUND",
        1: "ITEM",
      };
      return titles[this.guest.transactions.length] ?? "ITEMS";
    },
    hasData: function () {
      return !!this.guest.transactions.length ?? false;
    },
  },
};
</script>

<style scoped></style>
