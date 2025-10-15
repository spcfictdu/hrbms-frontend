<template>
  <div>
    <div class="d-flex my-5" :style="{ gap: '12px' }">
      <v-menu
        v-model="dateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined icon color="primary" v-bind="attrs" v-on="on">
            <v-icon>mdi-filter-variant</v-icon>
          </v-btn>
        </template>
        <v-date-picker
          v-model="selectedDate"
          no-title
          scrollable
          @input="selectDate"
        ></v-date-picker>
      </v-menu>

      <v-btn icon outlined color="primary">
        <v-icon>mdi-printer</v-icon>
      </v-btn>

      <slot name="icon" />
    </div>

    <v-row>
      <v-col v-for="(item, index) in buttons" :key="index">
        <v-btn
          height="90"
          x-large
          block
          depressed
          :color="selectedStatus === item.status ? 'primary' : 'lightBg'"
          @click="$emit('statusselect', item.status)"
        >
          <div class="d-flex flex-column align-center justify-center">
            <div
              class="text-h6"
              :class="
                selectedStatus === item.status
                  ? 'font-weight-medium'
                  : 'font-weight-regular'
              "
            >
              {{ item.count }}
            </div>
            <div
              class="text-subtitle-2"
              :class="
                selectedStatus === item.status
                  ? 'font-weight-medium'
                  : 'font-weight-regular'
              "
            >
              {{ item.status }}
            </div>
          </div>
        </v-btn>
      </v-col>
    </v-row>

    <slot />

    <DefaultTable
      class="my-6"
      :headers="headers"
      :items="items"
      :itemClass="rowClass"
      :itemsPerPage="-1"
      hideDefaultFooter
      @click:row="$emit('click:row', $event)"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :color="statusColors[item.status]"
          dark
          small
          class="text-overline text-uppercase"
        >
          {{ item.status }}
        </v-chip>
      </template>
      <!-- <template v-slot:[`item.menu`]="{ item }">
        <v-menu offset-x left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense class="py-0">
            <v-list-item
              class="menu-border"
              v-for="(menuItem, i) in menuItems"
              :key="i"
              @click="() => menuItem.action(item)"
            >
              <v-list-item-title class="text-body-2 font-weight-regular">
                {{ menuItem.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template> -->
    </DefaultTable>
  </div>
</template>

<script>
import DefaultTable from "../tables/DefaultTable.vue";
import { format } from "date-fns";

export default {
  name: "Reports",
  components: { DefaultTable },
  props: {
    headers: Array,
    buttons: Array,
    items: Array,
    // menuItems: Array,
    statusColors: Object,
    selectedStatus: String,
  },
  data() {
    return {
      dateMenu: false,
      selectedDate: "",
    };
  },
  watch: {
    "$route.query.date": {
      handler(newDate) {
        this.selectedDate = newDate || format(new Date(), "yyyy-MM-dd");
      },
      immediate: true,
    },
  },
  methods: {
    selectDate(date) {
      this.$emit("dateselect", date);
      this.dateMenu = false;
    },
    rowClass() {
      return "custom-row";
    },
  },
};
</script>

<style scoped>
.v-data-table {
  background-color: transparent !important;
}

.v-data-table >>> tr.custom-row td {
  height: 75px !important;
  border-bottom: 1px solid #e6e2e2;
}

/* .menu-border {
  border-bottom: 1px solid #e6e2e2;
} */
</style>
