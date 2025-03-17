<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :item-key="itemKey"
    :loading="loading"
    :footer-props="footerProps"
    :server-items-length="serverItemsLength"
    :options.sync="options"
    :disable-sort="disableSort"
    @click:row="$emit('click:row', $event)"
  >
  </v-data-table>
</template>

<script>
import serverPagination from "@/mixins/server-pagination";
export default {
  name: "PaginatedTable",
  mixins: [serverPagination],
  props: {
    serverItemsLength: Number,
    // Table Handling
    headers: Array,
    items: Array,
    itemKey: String,
    loading: Boolean,
    footerProps: Object,

    // Optional Props
    disableSort: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    search: "",
    // Items to include in the query params
    includedItems: ["page", "itemsPerPage", "sortBy", "sortDesc"],
  }),
};
</script>

<style scoped></style>
