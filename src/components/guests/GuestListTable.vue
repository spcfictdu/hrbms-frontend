<template>
  <v-container>
    <div>
      <v-row>
        <v-col cols="12">
          <div :class="guestClass">Guests</div>
        </v-col>
      </v-row>
    </div>
    <v-divider />
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="mt-5">
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
          <v-row>
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
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestListTable",
  data: () => ({
    show: false,
    indeterminate: true,
    value: 0,
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
    guestClass: "text-h5 font-weight-black mb-1",
  }),
  methods: {
    ...mapActions("guest", ["fetchGuests"]),
    test: function (row) {
      this.$router.push({
        name: "guest",
        params: { id: row.id },
      });
    },
  },
  computed: {
    ...mapState("guest", {
      guests: "guests",
    }),
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  created() {
    this.fetchGuests();
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
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.colsTextfield = 12;
          this.small = false;
          this.xSmall = true;
          this.guestClass =
            "d-flex text-h6 font-weight-bold justify-center mt-n3";
        } else if (newVal.sm) {
          this.guestClass = "text-h6 font-weight-bold mb-1";
          this.small = true;
          this.xSmall = false;
          this.colsTextfield = 6;
        } else {
          this.guestClass = "text-h5 font-weight-bold mb-1";
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
