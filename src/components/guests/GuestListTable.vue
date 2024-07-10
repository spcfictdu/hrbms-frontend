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
            >{{ guests.pagination.total }} GUESTS
            <v-spacer></v-spacer>
            <!-- Search Button -->
            <div v-if="show" class="d-flex">
              <v-btn
                :ripple="false"
                color="warning"
                @click="clearQuery"
                rounded
                class="d-none d-sm-flex mr-2"
                outlined
                >Clear</v-btn
              >
              <v-btn
                :ripple="false"
                color="warning"
                v-if="show && $vuetify.breakpoint.xs"
                @click="clearQuery"
                icon
                class="d-flex d-sm-none"
                ><v-icon>mdi-cached</v-icon></v-btn
              >
              <v-btn
                color="primary"
                rounded
                class="d-none d-sm-flex"
                @click="searchFunction"
                ><v-icon left>mdi-magnify</v-icon>Search</v-btn
              >
              <v-btn
                color="primary"
                class="d-flex d-sm-none"
                icon
                :ripple="false"
                @click="searchFunction"
                ><v-icon left>mdi-magnify</v-icon></v-btn
              >
            </div>
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
          <!-- Search Fields -->
          <v-row v-if="show" class="mx-3 text-subtitle-2 relative-position">
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">First Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchFirstName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Middle Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchMiddleName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Last Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchLastName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Booking Reference</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchRef"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Email</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchEmail"
                :rules="rules.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Phone</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                type="number"
                v-model="searchPhone"
                counter
                maxlength="11"
                hide-spin-buttons
                :rules="rules.phone"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Guest List -->
          <v-row>
            <v-col cols="12 mt-n10">
              <v-data-table
                @click:row="selectGuest"
                :headers="headers"
                :items="guests.guests"
                class="ma-5"
                :footer-props="{
                  itemsPerPage: [5, 10, 15],
                }"
                :options.sync="options"
                :server-items-length="guests.pagination.total"
                :search="search"
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
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "GuestListTable",
  data: () => ({
    searchFirstName: "",
    searchMiddleName: "",
    searchLastName: "",
    searchRef: "",
    searchEmail: "",
    searchPhone: "",
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
    colsTextfield: 3,
    small: true,
    xSmall: false,
    guestClass: "text-h5 font-weight-black mb-1",
    errors: {},
  }),
  props: {
    guests: {
      required: true,
    },
  },
  mixins: [TablePagination],
  methods: {
    searchFunction: function () {
      let triggerIndeterminate = false;

      if (this.searchFirstName) {
        this.query_params.firstName = this.searchFirstName;
        triggerIndeterminate = true;
      }
      if (this.searchMiddleName) {
        this.query_params.middleName = this.searchMiddleName;
        triggerIndeterminate = true;
      }
      if (this.searchLastName) {
        this.query_params.lastName = this.searchLastName;
        triggerIndeterminate = true;
      }
      if (this.searchRef) {
        this.query_params.referenceNumber = this.searchRef;
        triggerIndeterminate = true;
      }
      if (this.searchEmail) {
        this.query_params.email = this.searchEmail;
        triggerIndeterminate = true;
      }
      if (this.searchPhone) {
        this.query_params.phone = this.searchPhone;
        triggerIndeterminate = true;
      }

      if (triggerIndeterminate === true) {
        this.indeterminate = true;
        setTimeout(() => {
          this.indeterminate = false;
          triggerIndeterminate = false;
        }, 3000);
        this.value = 100;
      }

      this.$emit("query_params", this.query_params);
    },
    selectGuest: function (row) {
      this.$router.push({
        name: "guest",
        params: { id: row.id },
      });
    },
    clearQuery: function () {
      let triggerIndeterminate = false;
      if (this.searchFirstName) {
        this.searchFirstName = "";
        delete this.query_params.firstName;
        triggerIndeterminate = true;
      }

      if (this.searchMiddleName) {
        this.searchMiddleName = "";
        delete this.query_params.middleName;
        triggerIndeterminate = true;
      }

      if (this.searchLastName) {
        this.searchLastName = "";
        delete this.query_params.lastName;
        triggerIndeterminate = true;
      }

      if (this.searchRef) {
        this.searchRef = "";
        delete this.query_params.referenceNumber;
        triggerIndeterminate = true;
      }

      if (this.searchEmail) {
        this.searchEmail = "";
        delete this.query_params.email;
        triggerIndeterminate = true;
      }

      if (this.searchPhone) {
        this.searchPhone = "";
        delete this.query_params.phone;
        triggerIndeterminate = true;
      }

      if (triggerIndeterminate === true) {
        this.indeterminate = true;
        setTimeout(() => {
          this.indeterminate = false;
          triggerIndeterminate = false;
        }, 3000);
        this.value = 100;
      }

      this.$emit("query_params", this.query_params);
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
    rules: function () {
      const errors = {};

      if (this.searchEmail.length > 0) {
        errors.email = [(v) => /.+@.+\..+/.test(v) || "Invalid e-mail."];
      } else {
        delete errors.email;
      }

      if (this.searchPhone.length > 0) {
        errors.phone = [(v) => v.length === 11 || "Invalid number"];
      } else {
        delete errors.phone;
      }

      return errors;
    },
  },

  watch: {
    searchFirstName: {
      handler: function () {
        if (!this.searchFirstName || this.searchFirstName === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.firstName;
          this.$emit("query_params", this.query_params);
        }
      },
    },
    searchMiddleName: {
      handler: function () {
        if (!this.searchMiddleName || this.searchMiddleName === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.middleName;
          this.$emit("query_params", this.query_params);
        }
      },
    },
    searchLastName: {
      handler: function () {
        if (!this.searchLastName || this.searchLastName === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.lastName;
          this.$emit("query_params", this.query_params);
        }
      },
    },
    searchRef: {
      handler: function () {
        if (!this.searchRef || this.searchRef === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.referenceNumber;
          this.$emit("query_params", this.query_params);
        }
      },
    },
    searchEmail: {
      handler: function () {
        if (!this.searchEmail || this.searchEmail === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.email;
          this.$emit("query_params", this.query_params);
        }
      },
    },
    searchPhone: {
      handler: function () {
        if (!this.searchPhone || this.searchPhone === "") {
          this.indeterminate = true;
          setTimeout(() => {
            this.indeterminate = false;
          }, 3000);
          this.value = 100;
          delete this.query_params.phone;
          this.$emit("query_params", this.query_params);
        }
      },
    },
    "guests.guests": {
      immediate: true,
      handler(value) {
        if (value) {
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
