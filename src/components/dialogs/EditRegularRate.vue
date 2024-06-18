<template>
  <v-dialog v-model="isShow" max-width="500" overlay-opacity="0.2">
    <v-form ref="editRateForm">
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title :class="title"
          >Edit {{ regularFilled.room }}'s
          {{ regularFilled.editRateType }} Rate</v-card-title
        >
        <div class="mt-5" v-if="this.regularFilled.discount">
          <v-row>
            <v-col cols="12">
              <span class="text-body-2">Special Rate Name</span>
              <v-text-field
                outlined
                dense
                v-model="discountName"
                :rules="validate.discountName"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div v-if="this.regularFilled.discount">
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
                    :rules="validate.startDate"
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
                    :rules="validate.endDate"
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
              <div class="font-weight-bold mt-5 mb-0 text-subtitle-2">
                Price
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-if="!size.xs">
          <v-row v-for="(day, index) in days" :key="index" class="ma-3 mt-0">
            <v-col cols="6" class="text-body-2 py-2 mt-3">
              <span>{{ day.day }}</span>
            </v-col>
            <v-col cols="6" class="py-2"
              ><v-text-field
                outlined
                dense
                hide-details="auto"
                prefix="₱"
                v-model="day.rate"
                type="number"
                :rules="validate.day.rate"
            /></v-col>
          </v-row>
        </div>
        <div v-else>
          <v-row v-for="(day, index) in days" :key="index" class="ma-3">
            <v-col cols="12">
              <span class="text-body-1 ml-1">{{ day.day }}</span>
              <v-text-field
                outlined
                dense
                hide-details="auto"
                prefix="₱"
                v-model="day.rate"
                type="number"
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
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "EditRegularRate",
  data: () => ({
    minDate: new Date().toISOString().slice(0, 10),
    cols: 6,
    discountName: null,
    startDate: null,
    endDate: null,
    menuStart: false,
    menuEnd: false,
    payload: {
      rates: {},
    },
    title:
      "transparent-bg text-subtitle-1 font-weight-bold text-uppercase pa-0",
    small: false,
    days: [
      {
        day: "Sunday",
        rate: null,
      },
      {
        day: "Monday",
        rate: null,
      },
      {
        day: "Tuesday",
        rate: null,
      },
      {
        day: "Wednesday",
        rate: null,
      },
      {
        day: "Thursday",
        rate: null,
      },
      {
        day: "Friday",
        rate: null,
      },
      {
        day: "Saturday",
        rate: null,
      },
    ],
  }),
  props: {
    activator: {
      type: Boolean,
      required: true,
    },
    regularFilled: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isShow() {
      return this.activator;
    },
    size() {
      return this.$vuetify.breakpoint;
    },
    validate() {
      const errors = {};
      errors.discountName = [(v) => !!v || "Discount Name is required"];
      errors.startDate = [(v) => !!v || "Starting Discount Date is required"];
      errors.endDate = [(v) => !!v || "Last Discount Date is required"];
      errors.day.rate = [(v) => !!v || "Rate for this day is required"];
      return errors;
    },
  },
  methods: {
    ...mapActions("roomPrice", ["updateRegularRate", "updateSpecialRate"]),
    cancelButton: function () {
      this.payload.rates = {};
      this.$emit("reset-activator");
    },
    submitButton: function () {
      if (this.$refs.editRateForm.validate()) {
        if (this.regularFilled.editRateType === "SPECIAL") {
          Object.assign(this.payload, { discountName: this.discountName });
          Object.assign(this.payload, { startDate: this.startDate });
          Object.assign(this.payload, { endDate: this.endDate });
        }

        this.days.forEach((item) => {
          switch (item.day) {
            case "Sunday":
              Object.assign(this.payload.rates, { sunday: item.rate });
            case "Monday":
              Object.assign(this.payload.rates, { monday: item.rate });
            case "Tuesday":
              Object.assign(this.payload.rates, { tuesday: item.rate });
            case "Wednesday":
              Object.assign(this.payload.rates, { wednesday: item.rate });
            case "Thursday":
              Object.assign(this.payload.rates, { thursday: item.rate });
            case "Friday":
              Object.assign(this.payload.rates, { friday: item.rate });
            case "Saturday":
              Object.assign(this.payload.rates, { saturday: item.rate });
            default:
              return null;
          }
        });

        if (this.regularFilled.editRateType === "REGULAR") {
          this.updateRegularRate({
            data: this.payload,
            regularRefNum: this.regularFilled.regurlarRateRefNum,
            roomTypeRefNum: this.regularFilled.roomRefNum,
          })
            .then(() => {
              this.$refs.editRateForm.reset();
            })
            .catch((error) => {
              console.error("Error updating regular rates: ", error);
            })
            .finally(() => {
              this.$emit("reset-activator");
            });
        } else {
          this.updateSpecialRate({
            data: this.payload,
            specialRefNum: this.regularFilled.specialRateRefNum,
            roomTypeRefNum: this.regularFilled.roomRefNum,
          })
            .then(() => {
              this.$refs.editRateForm.resetValidation();
              this.$refs.editRateForm.reset();
            })
            .catch((error) => {
              console.error("Error updating special rates: ", error);
            })
            .finally(() => {
              this.$emit("reset-activator");
            });
        }
      }
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
    payload: {
      immediate: true,
      handler(value) {
        console.log("payload: ", value);
      },
    },
  },
};
</script>

<style scoped></style>
