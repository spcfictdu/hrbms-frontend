<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="text-subtitle-2 font-weight-black ml-3">
            {{ tableHeader }}
            <v-spacer></v-spacer>
            <div v-if="show" class="d-flex">
              <div class="mr-2">
                <v-btn
                  :ripple="false"
                  color="warning mr-1"
                  @click="clearFunction"
                  outlined
                  rounded
                  class="d-none d-sm-flex"
                  >Clear</v-btn
                >
                <v-btn
                  :ripple="false"
                  color="warning"
                  class="d-flex d-sm-none"
                  @click="clearFunction"
                  icon
                  ><v-icon left>mdi-cached</v-icon></v-btn
                >
              </div>

              <div>
                <v-btn
                  color="primary"
                  rounded
                  class="d-none d-sm-flex"
                  @click="searchFunction"
                  ><v-icon left>mdi-magnify</v-icon>Search</v-btn
                >
                <v-btn
                  color="primary"
                  icon
                  class="d-flex d-sm-none"
                  @click="searchFunction"
                  ><v-icon>mdi-magnify</v-icon></v-btn
                >
              </div>
            </div>

            <v-btn
              fab
              outlined
              :small="small"
              :x-small="xSmall"
              @click="show = !show"
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
                :value="indeterminateValue"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <v-row v-if="show" class="mx-3 text-subtitle-2">
            <v-col cols="12" sm="4">
              <span class="ml-2">Reference</span>
              <v-text-field
                dense
                outlined
                hide-details="auto"
                v-model="query_params.referenceNumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <span class="ml-2">Check-in Date</span>
              <v-menu
                v-model="menuCheckIn"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="query_params.checkInDate"
                    v-on="on"
                    v-bind="attrs"
                    outlined
                    dense
                    readonly
                    hide-details="auto"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="query_params.checkInDate"
                  @input="menuCheckIn = false"
                >
                  <v-btn color="primary" block @click="clearDate('Check In')"
                    >Clear</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="4">
              <span class="ml-2">Check-out Date</span>
              <v-menu
                v-model="menuCheckOut"
                :close-on-content-click="false"
                offset-y
                transition="scale-transition"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="query_params.checkOutDate"
                    v-on="on"
                    v-bind="attrs"
                    outlined
                    dense
                    readonly
                    hide-details="auto"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="query_params.checkOutDate"
                  @input="menuCheckOut = false"
                >
                  <v-btn color="primary" block @click="clearDate('Check Out')"
                    >Clear</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "GuestCardHeader",
  props: {
    guest: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    show: false,
    indeterminate: true,
    indeterminateValue: 0,
    small: true,
    xSmall: false,
    menuCheckIn: false,
    menuCheckOut: false,
    query_params: {},
  }),
  methods: {
    searchFunction: function () {
      let triggerIndeterminate = false;

      if (this.query_params) {
        this.$emit("search-query", this.query_params);
        this.loadingAction();
        triggerIndeterminate = false;
      }
    },
    clearFunction: function () {
      let triggerIndeterminate = false;

      if (this.searchRefNum) {
        this.searchRefNum = "";
        triggerIndeterminate = true;
      }
      if (this.searchCheckIn) {
        this.searchCheckIn = "";
        triggerIndeterminate = true;
      }
      if (this.searchCheckOut) {
        this.searchCheckOut = "";
        triggerIndeterminate = true;
      }

      this.query_params = {};

      if (triggerIndeterminate === true) {
        this.loadingAction();
      }

      this.$emit("clear-query", this.query_params);
    },
    loadingAction: function () {
      this.indeterminate = true;
      setTimeout(() => {
        this.indeterminate = false;
      }, 3000);
      this.indeterminateValue = 100;
    },
    clearDate: function (dateType) {
      if (dateType === "Check In") {
        this.query_params.checkInDate = "";
      } else {
        this.query_params.checkOutDate = "";
      }
    },
  },
  computed: {
    tableHeader: function () {
      if (this.guest.transactions.length === 0) {
        return "NO ITEMS FOUND";
      } else if (this.guest.transactions.length === 1) {
        return this.guest.transactions.length + " ITEM";
      } else if (this.guest.transactions.length > 1) {
        return this.guest.transactions.length + " ITEMS";
      }
    },
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    "guest.transactions": {
      immediate: true,
      handler(value) {
        if (value.length) {
          this.loadingAction();
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
          this.small = false;
          this.xSmall = true;
        } else {
          this.small = true;
          this.xSmall = false;
        }
      },
    },
    query_params: {
      deep: true,
      handler: function (newVal) {
        let query = ["referenceNumber", "checkInDate", "checkOutDate"];

        Object.keys(newVal).forEach((key) => {
          if (query.includes(key)) {
            console.log(key);
            if (!newVal[key] || newVal[key] === "") {
              delete newVal[key];
            }
          }
        });
      },
    },
  },
};
</script>

<style scoped></style>
