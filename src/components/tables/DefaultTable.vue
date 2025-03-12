<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :item-key="itemKey"
    :loading="loading"
    :footer-props="footerProps"
    :dense="dense"
    :hide-default-footer="hideDefaultFooter"
    :items-per-page="itemsPerPage"
    :options="options"
    @update:options="$emit('update:options', $event)"
    @click:row="$emit('click:row', $event)"
    elevation="0"
  >
  </v-data-table>
</template>

<script>
export default {
  name: "DefaultTable",
  props: {
    headers: Array,
    items: Array,
    itemKey: String,
    loading: Boolean,
    footerProps: Object,
    dense: {
      type: Boolean,
      default: false,
    },
    hideDefaultFooter: {
      type: Boolean,
      default: false,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    options: Object,
  },
};
</script>

<style scoped></style>
