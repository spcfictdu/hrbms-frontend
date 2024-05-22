<template>
  <v-dialog v-model="isShow" max-width="500" overlay-opacity="0.2">
    <v-card class="pa-5" rounded="lg" flat>
      <v-card-title
        class="transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0"
        >Edit Deluxe Room's Regular Rate</v-card-title
      >
      <div>
        <v-row>
          <v-col cols="12">
            <span>Special Rate Name</span>
            <v-text-field></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col cols="6">
            <span>Start Date</span>
            <v-date-picker
              v-model="startDate"
              :min="minDate"
              @change="menu = false"
            ></v-date-picker>
          </v-col>
          <v-col cols="6">
            <span>End Date</span>
            <v-date-picker
              v-model="endDate"
              :min="minDate"
              @change="menu = false"
            ></v-date-picker>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col cols="6">
            <div class="font-weight-bold">Day</div>
          </v-col>
          <v-col cols="6">
            <div class="font-weight-bold">Price</div>
          </v-col>
        </v-row>
      </div>
      <div v-if="!size.xs">
        <v-row v-for="(day, index) in days" :key="index" class="ma-3">
          <v-col cols="6" class="text-subtitle-1">
            <span>{{ day.day }}</span>
          </v-col>
          <v-col cols="6"
            ><v-text-field outlined dense hide-details="auto"
          /></v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row v-for="(day, index) in days" :key="index" class="ma-3">
          <v-col cols="12" class="text-subtitle-1">
            <span>{{ day.day }}</span>
            <v-text-field outlined dense hide-details="auto"
          /></v-col>
        </v-row>
      </div>
      <div>
        <v-row v-for="(day, index) in days" :key="index" class="ma-3">
          <v-col cols="6" class="text-subtitle-1">{{ day.day }}</v-col>
          <v-col cols="6"
            ><v-text-field outlined dense hide-details="auto"
          /></v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col cols="6">
            <v-btn block text color="warning">Cancel</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block text color="primary">Save Changes</v-btn>
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
    menu: false,
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
};
</script>

<style scoped></style>
