<template>
  <v-container class="mt-lg-5">
    <v-row>
      <v-col cols="12"><div :class="title" >Transactions</div></v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="text-subtitle-2 font-weight-black ml-3">
            {{ items.length }} ITEMS
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              rounded
              v-if="show && !$vuetify.breakpoint.xs"
              class="text-button"
              justify="space-around"
              ><v-icon left>mdi-magnify</v-icon>Search</v-btn
            >
            <v-btn
              color="primary"
              icon
              v-if="show && $vuetify.breakpoint.xs"
              class="text-button"
              ><v-icon>mdi-magnify</v-icon></v-btn
            >
            <v-btn
              fab
              outlined
              @click="show = !show"
              :small="small"
              :x-small="xSmall"
              color="primary"
              class="ml-2"
            >
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </v-card-title>
          <v-row>
            <v-col cols="12">
              <v-progress-linear
                color="amber"
                :indeterminate="indeterminate"
                :value="value"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row v-if="show" class="mx-3 text-subtitle-2">
            <v-col
              :cols="colsTextfield"
              v-for="(header, index) in textfieldHeaders"
              :key="index"
            >
              <span class="ml-2">{{ header }}</span>
              <v-text-field outlined dense></v-text-field>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="items"> </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TransactionsTable",
  data: () => ({
    title: "text-h5 font-weight-black",
    show: false,
    indeterminate: true,
    value: 0,
    small: true,
    xSmall: false,
    colsTextfield: 4,
    items: [
      {
        date: "May 20, 2024",
        content: [
          {
            name: "Camerino, Maria Santos",
            status: "Checked-out",
            reference: "BKG-234567-20240514",
            occupants: "5",
            checkIn: "05-20-2024",
            checkOut: "05-22-2024",
            booked: "05-18-2024",
            room: "Room 145",
            total: "3500",
          },
          {
            name: "Dela Cruz, Juan Flores",
            status: "Reserved",
            reference: "BKG-234567-20240514",
            occupants: "3",
            checkIn: "",
            checkOut: "",
            booked: "05-19-2024",
            room: "Room 146",
            total: "3000",
          },
          {
            name: "Cruz, Jose Rizal",
            status: "Confirmed",
            reference: "BKG-345678-20240514",
            occupants: "1",
            checkIn: "",
            checkOut: "",
            booked: "05-18-2024",
            room: "Room 147",
            total: "3123",
          },
          {
            name: "De Jesus, Angelica Reyes",
            status: "Checked-in",
            reference: "BKG-456789-20240514",
            occupants: "2",
            checkIn: "05-20-2024",
            checkOut: "",
            booked: "05-19-2024",
            room: "Room 148",
            total: "4578",
          },
        ],
      },
    ],
    headers: [
      {
        text: "Name",
        value: "",
      },
      {
        text: "Status",
        value: "",
      },
      {
        text: "Reference",
        value: "",
      },
      {
        text: "Occupants",
        value: "",
      },
      {
        text: "Check-in",
        value: "",
      },
      {
        text: "Check-out",
        value: "",
      },
      {
        text: "Booked",
        value: "",
      },
      {
        text: "Room",
        value: "",
      },
      {
        text: "Total",
        value: "",
      },
    ],
    textfieldHeaders: [
      "First Name",
      "Middle Name",
      "Last Name",
      "Reference",
      "Check-in Date",
      "Check-out Date",
    ],
  }),
  watch: {
    items: {
      immediate: true,
      handler(value) {
        if (value.length) {
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
        } else {
          this.indeterminate = false;
        }
      },
    },
    "$vuetify.breakpoint": {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs === true) {
          this.title = "d-flex text-h6 font-weight-black justify-center mt-n3";
          this.small = false;
          this.xSmall = true;
          this.colsTextfield = 6;
        } else {
          this.title = "text-h5 font-weight-black";
          this.small = true;
          this.xSmall = false;
          this.colsTextfield = 4;
        }
      },
    },
  },
};
</script>

<style scoped></style>
