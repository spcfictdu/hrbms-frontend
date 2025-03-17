<template>
  <v-card flat>
    <GuestListCardHeader :guests="guests" @onQuery="assignParams($event)" />
    <!-- Guest List -->
    <div class="pa-5">
      <PaginatedTable
        :headers="headers"
        :items="guests.guests"
        :footerProps="footerProps"
        :serverItemsLength="guests.pagination.total"
        disabledSort
        itemKey="id"
        @onQuery="assignParams($event)"
        @click:row="handleSelectRow"
      />
    </div>
  </v-card>
</template>

<script>
import GuestListCardHeader from "../../table-headers/GuestListTableHeader.vue";
import PaginatedTable from "../PaginatedTable.vue";
import { assignParams } from "@/mixins/FormattingFunctions";
export default {
  name: "GuestListTable",
  components: { GuestListCardHeader, PaginatedTable },
  mixins: [assignParams],
  props: {
    guests: Object,
  },
  data: () => ({
    headers: [
      {
        text: "Name",
        value: "fullName",
      },
      {
        text: "Booking Reference",
        value: "referenceNumber",
      },
      {
        text: "Email",
        value: "email",
      },
      {
        text: "Phone",
        value: "phone",
      },
    ],
    footerProps: {
      itemsPerPage: [5, 10, 15],
    },
  }),
  methods: {
    handleSelectRow: function (row) {
      this.$router.push({
        name: "guest",
        params: { id: row.id },
      });
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
