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
    :disable-sort="disableSort"
    @update:options="$emit('update:options', $event)"
    @click:row="$emit('click:row', $event)"
    elevation="0"
  >
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
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
    disableSort: {
      type: Boolean,
      default: false,
    },
    options: Object,
  },
};
</script>

<style scoped></style>
