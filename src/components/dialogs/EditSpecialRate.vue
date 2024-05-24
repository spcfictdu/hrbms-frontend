<template>
  <v-dialog v-model="isShow" max-width="500" overlay-opacity="0.2">
    <v-card class="pa-8" rounded="lg" flat>
      <v-card-title :class="title"
        >Edit Deluxe Room's Special Rate</v-card-title
      >
      <div class="mt-5">
        <v-row>
          <v-col cols="12">
            <span class="text-body-2">Special Rate Name</span>
            <v-text-field outlined dense></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col :cols="cols">
            <span class="text-body-2">Start Date</span>
            <v-menu
              :close-on-content-click="false"
              offset-y
              transition="scale-transition"
              v-model="menuStart"
              min-width="auto"
              max-width="290"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="startDate"
                  v-on="on"
                  v-bind="attrs"
                  outlined
                  dense
                  readonly
                  hide-details="auto"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                :min="minDate"
                @input="menuStart = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col :cols="cols">
            <span class="text-body-2">End Date</span>
            <v-menu
              v-model="menuEnd"
              :close-on-content-click="false"
              offset-y
              transition="scale-transition"
              min-width="auto"
              max-width="290"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="endDate"
                  v-on="on"
                  v-bind="attrs"
                  outlined
                  dense
                  readonly
                  hide-details="auto"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                :min="minDate"
                @input="menuEnd = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </div>
      <div v-if="!size.xs">
        <v-row>
          <v-col cols="6">
            <div class="font-weight-bold mt-5 ml-6 mb-0 text-subtitle-2">
              Day
            </div>
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold mt-5 mb-0 text-subtitle-2">Price</div>
          </v-col>
        </v-row>
      </div>
      <div v-if="!size.xs">
        <v-row v-for="(day, index) in days" :key="index" class="ma-3 mt-0">
          <v-col cols="6" class="text-body-2 py-2 mt-3">
            <span>{{ day.day }}</span>
          </v-col>
          <v-col cols="6" class="py-2"
            ><v-text-field outlined dense hide-details="auto" prefix="₱"
          /></v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row v-for="(day, index) in days" :key="index">
          <v-col cols="12">
            <span class="text-body-2 ml-1">{{ day.day }}</span>
            <v-text-field outlined dense hide-details="auto"
          /></v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col cols="6">
            <v-btn
              block
              text
              color="warning"
              @click="cancelButton"
              :small="small"
              >Cancel</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              text
              color="primary"
              @click="submitButton"
              :small="small"
              >Save Changes</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditSpecialRate",
  data: () => ({
    minDate: new Date().toISOString().slice(0, 10),
    startDate: null,
    endDate: null,
    menuStart: false,
    menuEnd: false,
    cols: 6,
    title:
      "transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0",
    small: false,
    days: [
      {
        day: "Sunday",
      },
      {
        day: "Monday",
      },
      {
        day: "Tuesday",
      },
      {
        day: "Wednesday",
      },
      {
        day: "Thursday",
      },
      {
        day: "Friday",
      },
      {
        day: "Saturday",
      },
    ],
  }),
  props: {
    activator: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isShow: function () {
      return this.activator;
    },
    size: function () {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    cancelButton: function () {
      this.$emit("reset-activator");
    },
    submitButton: function () {
      this.$emit("reset-activator");
    },
  },
  watch: {
    size: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.xs) {
          this.title =
            "transparent-bg text-subtitle-2 font-weight-bold text-uppercase pa-0";
          this.small = true;
          this.cols = 12;
        } else {
          this.title =
            "transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0";
          this.small = false;
          this.cols = 6;
        }
      },
    },
  },
};
</script>

<style scoped></style>
