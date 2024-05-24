<template>
  <v-dialog v-model="isShow" max-width="500" overlay-opacity="0.2">
    <v-card class="pa-8" rounded="lg" flat>
      <v-card-title :class="title"
        >Edit Deluxe Room's Regular Rate</v-card-title
      >
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
        <v-row v-for="(day, index) in days" :key="index" class="ma-3">
          <v-col cols="12">
            <span class="text-body-1 ml-1">{{ day.day }}</span>
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
  name: "EditRegularRate",
  data: () => ({
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
    isShow () {
      return this.activator;
    },
    size () {
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
        } else {
          this.title =
            "transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0";
          this.small = false;
        }
      },
    },
  },
};
</script>

<style scoped></style>
