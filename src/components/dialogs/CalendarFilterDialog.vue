<template>
  <v-dialog max-width="600" v-model="dialog" overlay-opacity="0.2">
    <v-card class="pa-8" rounded="lg" flat>
      <v-card-title
        class="transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0"
        >Filter by Date</v-card-title
      >

      <div class="my-8">
        <div class="text-caption ml-1 mb-1">
          Show available rooms on the specified date and above.
        </div>

        <v-menu
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
          v-model="menu"
          min-width="auto"
          max-width="290"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              outlined
              dense
              readonly
              hide-details="auto"
              :value="dateRangeText"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateRange"
            :min="minDate"
            range
            @change="menu = false"
          ></v-date-picker>
        </v-menu>
      </div>

      <v-card-actions class="pa-0">
        <v-row dense>
          <v-col cols="12" sm="6" :order="breakpoints.cancelButton.order">
            <v-btn
              text
              block
              max-width="50%"
              :color="cancelColor"
              @click="dialog = false"
              >Cancel</v-btn
            >
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              text
              block
              max-width="50%"
              class="lightBg"
              :color="proceedColor"
              @click="requestFilter"
              >Proceed</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CalendarFilterDialog",
  data: () => ({
    dialog: false,
    cancelColor: "housekeeping",
    proceedColor: "primary",
    menu: false,
    dateRange: [],
    minDate: new Date().toISOString().slice(0, 10),
    breakpoints: {
      cancelButton: {},
    },
  }),
  props: {
    activator: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    requestFilter: function () {
      this.$emit("request-filter", this.dateRange);
      this.dialog = false;
    },
  },
  computed: {
    dateRangeText() {
      const formattedDates = this.dateRange.map((item) =>
        new Date(item).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      return formattedDates.join(" - ");
    },
    size() {
      return this.$vuetify.breakpoint;
    },
  },
  watch: {
    activator: {
      deep: true,
      handler: function (newVal) {
        this.dialog = newVal;
      },
    },
    dialog: {
      deep: true,
      handler: function (newVal) {
        if (!newVal) {
          this.$emit("reset-activator", newVal);
        }
      },
    },
    size: {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        if (newVal.xs) {
          this.breakpoints.cancelButton.order = "last";
        } else {
          this.breakpoints.cancelButton.order = "";
        }
      },
    },
  },
};
</script>

<style scoped>
.transparent-bg {
  background-color: transparent !important;
}
</style>
