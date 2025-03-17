<template>
  <TableFilter
    :numberOfItems="guests.pagination.total"
    item="GUESTS"
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
        />
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Middle Name">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.middleName"
        />
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Last Name">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.lastName"
        />
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Booking Reference">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.referenceNumber"
        />
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Email">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="queryParams.email"
        />
      </FormField>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <FormField label="Phone">
        <v-text-field
          outlined
          dense
          hide-details="auto"
          type="tel"
          v-model="queryParams.phoneNumber"
          counter
          maxlength="11"
        />
      </FormField>
    </v-col>
  </TableFilter>
</template>

<script>
import TableFilter from "./TableFilter.vue";
import FormField from "../fields/FormField.vue";
export default {
  name: "GuestListTableHeader",
  components: { TableFilter, FormField },
  props: {
    guests: Object,
  },
  data: () => ({
    queryParams: {
      firstName: null,
      middleName: null,
      lastName: null,
      referenceNumber: null,
      email: null,
      phoneNumber: null,
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

      this.$emit("onQuery", this.queryParams);
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
    hasData: function () {
      return !!this.guests ?? false;
    },
  },
};
</script>

<style scoped></style>
