<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div :class="guestClass">Guests</div>
      </v-col>
    </v-row>
    <v-row class="mt-n3">
      <v-col cols="12">
        <div><v-divider></v-divider></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="text-subtitle-2 font-weight-black ml-3"
            >{{ guests.length }} GUESTS
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
          <v-row class="mt-n3">
            <v-col cols="12">
              <v-data-table
                @click:row="test"
                :headers="headers"
                :items="guests"
                class="ma-5"
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GuestListTable",
  data: () => ({
    guests: [
      {
        name: "Dela Cruz, Juan Flores",
        booking: "BKG-987654-20240514",
        email: "juan.delacruz@gmail.com",
        phone: "09123456789",
        id: 1,
      },
      {
        name: "Camerino, Maria Santos",
        booking: "BKG-234567-20240514",
        email: "jose.rizal@gmail.com",
        phone: "09229876543",
        id: 2,
      },
      {
        name: "Cruz, Jose Rizal",
        booking: "BKG-345678-20240514",
        email: "juan.delacruz@gmail.com",
        phone: "09229876543",
        id: 3,
      },
      {
        name: "De Jesus, Angelica Reyes",
        booking: "BKG-456789-20240514",
        email: "angelica.reyes@gmail.com",
        phone: "09278765432",
        id: 4,
      },
      {
        name: "Quizon, Manuel Gonzales",
        booking: "BKG-567890-20240514",
        email: "manuel.gonzales@gmail.com",
        phone: "09187654321",
        id: 5,
      },
    ],
    show: false,
    indeterminate: true,
    value: 0,
    headers: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Booking Reference",
        value: "booking",
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
    textfieldHeaders: [
      "First Name",
      "Middle Name",
      "Last Name",
      "Booking Reference",
      "Email",
      "Phone",
    ],
    colsTextfield: 4,
    small: true,
    xSmall: false,
    guestClass: "text-h5 font-weight-black",
  }),
  methods: {
    test: function (row) {
      this.$router.push({
        name: "guest",
        params: { id: row.id },
      });
    },
  },
  watch: {
    guests: {
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
          this.colsTextfield = 6;
          this.small = false;
          this.xSmall = true;
          this.guestClass =
            "d-flex text-h6 font-weight-black justify-center mt-n3";
        } else {
          this.colsTextfield = 4;
          this.small = true;
          this.xSmall = false;
          this.guestClass = "text-h5 font-weight-black";
        }
      },
    },
  },
};
</script>

<style scoped></style>
