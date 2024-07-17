<template>
  <div>
    <v-card-title class="text-subtitle-2 font-weight-black ml-3"
      >{{ guests.pagination.total }} GUESTS
      <v-spacer></v-spacer>
      <!-- Search Button -->
      <div v-if="show" class="d-flex">
        <div class="mr-2">
          <v-btn
            :ripple="false"
            color="warning"
            @click="clearQuery"
            rounded
            class="d-none d-sm-flex"
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
            class="d-flex d-sm-none"
            icon
            :ripple="false"
            @click="searchFunction"
            ><v-icon left>mdi-magnify</v-icon></v-btn
          >
        </div>
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
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
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
    <!-- Search Fields -->
    <v-row v-if="show" class="mx-3 text-subtitle-2 relative-position">
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">First Name</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.firstName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Middle Name</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.middleName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Last Name</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.lastName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Booking Reference</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.referenceNumber"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Email</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          v-model="query_params.email"
          :rules="rules.email"
          ref="textfieldRef"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="ml-2">Phone</span>
        <v-text-field
          outlined
          dense
          hide-details="auto"
          type="number"
          v-model="query_params.phoneNumber"
          counter
          maxlength="11"
          hide-spin-buttons
          :rules="rules.phone"
          ref="textfieldRef"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TablePagination from "@/mixins/TablePagination";

export default {
  name: "GuestListCardHeader",
  props: {
    guests: {
      type: Object,
      required: true,
    },
  },
  mixins: [TablePagination],
  data: () => ({
    show: false,
    indeterminate: true,
    indeterminateValue: 0,
    small: true,
    xSmall: false,
  }),
  methods: {
    searchFunction: function () {
      if (this.$refs.textfieldRef.validate()) {
        if (Object.keys(this.query_params).length !== 0) {
          this.$emit("query-request", this.query_params);
          this.loadingAction();
        }
      }
    },
    clearQuery: function () {
      let query = [
        "firstName",
        "middleName",
        "lastName",
        "referenceNumber",
        "email",
        "phoneNumber",
      ];

      if (Object.keys(this.query_params).length !== 0) {
        Object.keys(this.query_params).forEach((key) => {
          if (query.includes(key)) {
            this.$set(this.query_params, key, null);
            // delete this.query_params[key];
          }
        });
        this.$emit("query-request", this.query_params);
        this.loadingAction();
      }
      this.$refs.textfieldRef.reset();
    },
    loadingAction: function () {
      this.indeterminate = true;
      setTimeout(() => {
        this.indeterminate = false;
      }, 3000);
      this.indeterminateValue = 100;
    },
  },
  computed: {
    size: function () {
      return this.$vuetify.breakpoint;
    },
    rules: function () {
      const errors = {};

      if (this.query_params.email) {
        errors.email = [
          (v) => /.+@.+\..+/.test(v) || "Please put a valid e-mail.",
        ];
      } else {
        delete errors.email;
      }

      if (this.query_params.phoneNumber) {
        errors.phone = [
          (v) => v.length === 11 || "Please put a valid phone number",
        ];
      } else {
        delete errors.phone;
      }

      return errors;
    },
  },
  watch: {
    "guests.guests": {
      immediate: true,
      handler(value) {
        if (value) {
          this.loadingAction();
        } else {
          this.indeterminate = false;
          this.indeterminateValue = 0;
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
        } else if (newVal.sm) {
          this.small = true;
          this.xSmall = false;
        } else {
          this.small = true;
          this.xSmall = false;
        }
      },
    },
    query_params: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        let query = [
          "firstName",
          "middleName",
          "lastName",
          "referenceNumber",
          "email",
          "phoneNumber",
        ];

        Object.keys(newVal).forEach((key) => {
          if (query.includes(key)) {
            if (!newVal[key] || newVal[key] === "") {
              // delete newVal[key];
              this.$set(newVal, key, null);
            }
          }
        });

        // if (Object.keys(newVal).length === 0) {
        //   this.$emit("query-request", this.query_params);
        // }
      },
    },
  },
};
</script>

<style scoped></style>
