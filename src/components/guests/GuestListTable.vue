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
            <v-btn
              color="primary"
              rounded
              v-if="show && !$vuetify.breakpoint.xs"
              justify="space-around"
              @click="searchFunction"
              ><v-icon left>mdi-magnify</v-icon>Search</v-btn
            >
            <v-btn
              color="primary"
              icon
              v-if="show && $vuetify.breakpoint.xs"
              :ripple="false"
              @click="searchFunction"
              ><v-icon left>mdi-magnify</v-icon></v-btn
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
          <!-- Search Fields -->
          <v-row v-if="show" class="mx-3 text-subtitle-2 relative-position">
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">First Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchFirstName"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Middle Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchMiddleName"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Last Name</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchLastName"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Booking Reference</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchRef"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <span class="ml-2">Email</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                v-model="searchEmail"
                clearable
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
                clearable
                counter
                maxlength="11"
              ></v-text-field>
            </v-col>
            <!-- Clear Button -->
            <v-col class="d-flex justify-end mt-n5 pt-0">
              <v-btn
                class="mr-n4"
                :ripple="false"
                color="warning"
                v-if="show"
                @click="clearQuery"
                text
                >Clear</v-btn
              >
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
  }),
  props: {
    guests: {
      required: true,
    },
  },
  mixins: [TablePagination],
  methods: {
    searchFunction: function () {
      if (this.searchFirstName) {
        this.query_params.firstName = this.searchFirstName;
      }
      if (this.searchMiddleName) {
        this.query_params.middleName = this.searchMiddleName;
      }
      if (this.searchLastName) {
        this.query_params.lastName = this.searchLastName;
      }
      if (this.searchRef) {
        this.query_params.referenceNumber = this.searchRef;
      }
      if (this.searchEmail) {
        this.query_params.email = this.searchEmail;
      }
      if (this.searchPhone) {
        this.query_params.phone = this.searchPhone;
      }

      this.indeterminate = true;

      setTimeout(() => {
        this.indeterminate = false;
      }, 3000);
      this.value = 100;

      this.$emit("query_params", this.query_params);
    },
    selectGuest: function (row) {
      this.$router.push({
        name: "guest",
        params: { id: row.id },
      });
    },
    clearQuery: function () {
      this.searchFirstName = "";
      delete this.query_params.firstName;

      this.searchMiddleName = "";
      delete this.query_params.middleName;

      this.searchLastName = "";
      delete this.query_params.lastName;

      this.searchRef = "";
      delete this.query_params.referenceNumber;

      this.searchEmail = "";
      delete this.query_params.email;

      this.searchPhone = "";
      delete this.query_params.phone;

      setTimeout(() => {
        this.indeterminate = false;
      }, 3000);
      this.value = 100;

      this.$emit("query_params", this.query_params);
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },

  watch: {
    searchFirstName: {
      handler: function () {
        if (!this.searchFirstName) {
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
        if (!this.searchMiddleName) {
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
        if (!this.searchLastName) {
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
        if (!this.searchRef) {
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
        if (!this.searchEmail) {
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
        if (!this.searchPhone) {
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
