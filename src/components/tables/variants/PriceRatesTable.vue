<template>
  <div>
    <DefaultTable
      :items="value"
      :headers="headers"
      hideDefaultFooter
      dense
      itemsPerPage="5"
      :options="{ page }"
      @click:row="$emit('click:row', $event)"
      @update:options="page = $event.page"
    />
    <div
      class="mt-2"
      :class="{
        'd-flex justify-space-between align-center': value.length > 5,
      }"
    >
      <div
        class="d-flex align-center"
        style="gap: 16px"
        v-if="value.length > 5"
      >
        <v-btn
          :disabled="isFirstPage"
          @click="prev()"
          fab
          text
          x-small
          color="grey darken-2"
        >
          <v-icon> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn
          :disabled="isLastPage"
          @click="next()"
          fab
          text
          x-small
          color="grey darken-2"
        >
          <v-icon> mdi-chevron-right </v-icon>
        </v-btn>
      </div>
      <div class="text-caption grey--text text--darken-2 text-right">
        *click a row to view its discount range
      </div>
    </div>
  </div>
</template>

<script>
import DefaultTable from "../DefaultTable.vue";
export default {
  name: "PriceRatesTable",
  components: { DefaultTable },
  props: {
    value: Array,
  },
  data: () => ({
    page: 1,
    headers: [
      {
        text: "Rates (in peso)",
        value: "rate",
        width: "120",
      },
      {
        text: "Sun",
        value: "sunday",
      },
      {
        text: "Mon",
        value: "monday",
      },
      {
        text: "Tue",
        value: "tuesday",
      },
      {
        text: "Wed",
        value: "wednesday",
      },
      {
        text: "Thu",
        value: "thursday",
      },
      {
        text: "Fri",
        value: "friday",
      },
      {
        text: "Sat",
        value: "saturday",
      },
    ],
  }),
  methods: {
    // Pagination
    next: function () {
      this.page++;
    },
    prev: function () {
      this.page--;
    },
  },
  computed: {
    numberOfPages: function () {
      return this.value ? Math.ceil(this.value.length / 5) : 0;
    },
    isLastPage: function () {
      return this.numberOfPages === 1 || this.page === this.numberOfPages;
    },
    isFirstPage: function () {
      return this.numberOfPages === 1 || this.page === 1;
    },
  },
};
</script>

<style scoped></style>
