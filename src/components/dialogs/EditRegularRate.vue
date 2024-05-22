<template>
  <v-dialog v-model="isShow" max-width="500" overlay-opacity="0.2">
    <v-card class="pa-5" rounded="lg" flat>
      <v-card-title class="transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0">Edit Regular Date</v-card-title>
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
      <div>
        <v-row v-for="(day, index) in days" :key="index" class="ma-3">
          <v-col cols="6" class="text-subtitle-1">{{ day.day }}</v-col>
          <v-col cols="6"><v-text-field outlined dense hide-details="auto"/></v-col>
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
  name: "EditRegularRate",
  data: () => ({
    days: [
        {
            day: "Sunday"
        },
        {
            day: "Monday"
        },
        {
            day: "Tuesday"
        },
        {
            day: "Wednesday"
        },
        {
            day: "Thursday"
        },
        {
            day: "Friday"
        },
        {
            day: "Saturday"
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
  },
};
</script>

<style scoped></style>
