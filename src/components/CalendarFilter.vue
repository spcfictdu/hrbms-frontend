<template>
  <v-dialog v-model="dialog" max-width="600">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" v-on="on" v-bind="attrs">Filter</v-btn>
    </template>
    <v-card>
      <v-card-title>Filter</v-card-title>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <v-select
        v-model="mode"
        :items="modes"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CalendarFilter",
  data: () => ({
    dialog: false,
  }),
};
</script>

<style scoped></style>
