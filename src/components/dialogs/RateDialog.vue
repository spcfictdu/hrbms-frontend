<template>
  <v-dialog v-model="dialog" max-width="600" overlay-opacity="0.2">
    <v-form ref="form" lazy-validation>
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0 mb-4"
          >{{ rateMeta.typeOfAction }} {{ rateMeta.roomType }} Room's
          {{ rateMeta.rateType }} Rate
        </v-card-title>

        <!-- Special Rate -->
        <div v-if="rateMeta.rateType === 'special'">
          <v-row>
            <v-col cols="12">
              <label-slot>
                <template #label> Special Rates </template>
              </label-slot>
              <v-autocomplete
                hide-details="auto"
                outlined
                dense
                :items="specialRateTypes"
                item-text="referenceNumber"
              >
                <template #item="{ item }">
                  <div>
                    <div class="text-subtitle-2">{{ item.discountName }}</div>
                    <div class="text-caption grey--text text-darken--2">
                      {{ item.referenceNumber }}
                    </div>
                  </div>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <label-slot>
                <template #label> Special Rate Name </template>
              </label-slot>
              <v-text-field
                hide-details="auto"
                outlined
                dense
                v-model="discountName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <label-slot>
                <template #label> Start Date </template>
              </label-slot>
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
            <v-col cols="12" sm="6">
              <label-slot>
                <template #label> End Date </template>
              </label-slot>
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

        <!-- Pricing -->
        <div class="py-4">
          <v-row class="d-none d-sm-flex">
            <v-col cols="6">
              <div class="font-weight-bold text-subtitle-2">Day</div>
            </v-col>
            <v-col cols="6">
              <div class="ml-1 font-weight-bold text-subtitle-2">Price</div>
            </v-col>
          </v-row>

          <!-- Mobile Breakpoint -->
          <p
            class="d-flex d-sm-none text-overline font-weight-bold text-uppercase"
          >
            Pricing
          </p>

          <v-row v-for="(day, index) in rates" :key="index" align="center">
            <v-col cols="6" class="d-none d-sm-flex">
              <span class="text-subtitle-2 font-weight-regular">{{
                day.day
              }}</span>
            </v-col>
            <v-col cols="12" sm="6">
              <!-- Mobile Breakpoint -->
              <div class="d-flex d-sm-none text-caption ml-1 mb-1">
                {{ day.day }}
              </div>

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

        <!-- <div>
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
        </div> -->
        <v-card-actions class="mt-4 pa-0">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first">
              <v-btn block text color="warning" @click="cancelButton"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block text color="primary" class="lightBg"
                >Save Changes</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
import LabelSlot from "../slots/LabelSlot.vue";
export default {
  name: "RateDialog",
  components: {
    LabelSlot,
  },
  props: {
    activator: {
      type: Boolean,
      required: true,
    },
    rateMeta: {
      type: Object,
    },
  },
  data: () => ({
    dialog: null,
    minDate: new Date().toISOString().slice(0, 10),
    discountName: null,
    startDate: null,
    endDate: null,
    menuStart: false,
    menuEnd: false,
    payload: {
      rates: {},
    },
    small: false,
    rates: [
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
  computed: {
    ...mapState("rateTypeEnum", {
      rateType: "rateType",
    }),
    size() {
      return this.$vuetify.breakpoint;
    },
    specialRateTypes: function () {
      return this.rateMeta.rateType === "special" && this.rateType
        ? this.rateType.map((key) => ({
            discountName: key.discountName,
            referenceNumber: key.referenceNumber,
          }))
        : [];
    },
    // validate() {
    //   const errors = {};
    //   errors.discountName = [(v) => !!v || "Discount Name is required"];
    //   errors.startDate = [(v) => !!v || "Starting Discount Date is required"];
    //   errors.endDate = [(v) => !!v || "Last Discount Date is required"];
    //   errors.day.rate = [(v) => !!v || "Rate for this day is required"];
    //   return errors;
    // },
  },
  methods: {
    ...mapActions("rateTypeEnum", ["fetchRateType"]),
    cancelButton: function () {
      this.payload.rates = {};
      this.$emit("reset-activator");
    },
    requestRateTypes: function (meta) {
      if (meta.typeOfAction === "EDIT") {
        this.fetchRateType({
          roomType: meta.roomType,
          rateType: meta.rateType,
        });
      }
    },
    assignRateTypes: function (rateType) {
      const pricingData = rateType[0];

      this.rates.forEach((key) => {
        switch (key.day) {
          case "Sunday":
            key.rate = pricingData.sunday;
            break;
          case "Monday":
            key.rate = pricingData.monday;
            break;
          case "Tuesday":
            key.rate = pricingData.tuesday;
            break;
          case "Wednesday":
            key.rate = pricingData.wednesday;
            break;
          case "Thursday":
            key.rate = pricingData.thursday;
            break;
          case "Friday":
            key.rate = pricingData.friday;
            break;
          case "Saturday":
            key.rate = pricingData.saturday;
            break;
        }
      });
    },
    // submitButton: function () {
    //   if (this.$refs.editRateForm.validate()) {
    //     if (this.regularFilled.editRateType === "SPECIAL") {
    //       Object.assign(this.payload, { discountName: this.discountName });
    //       Object.assign(this.payload, { startDate: this.startDate });
    //       Object.assign(this.payload, { endDate: this.endDate });
    //     }

    //     this.days.forEach((item) => {
    //       switch (item.day) {
    //         case "Sunday":
    //           Object.assign(this.payload.rates, { sunday: item.rate });
    //         case "Monday":
    //           Object.assign(this.payload.rates, { monday: item.rate });
    //         case "Tuesday":
    //           Object.assign(this.payload.rates, { tuesday: item.rate });
    //         case "Wednesday":
    //           Object.assign(this.payload.rates, { wednesday: item.rate });
    //         case "Thursday":
    //           Object.assign(this.payload.rates, { thursday: item.rate });
    //         case "Friday":
    //           Object.assign(this.payload.rates, { friday: item.rate });
    //         case "Saturday":
    //           Object.assign(this.payload.rates, { saturday: item.rate });
    //         default:
    //           return null;
    //       }
    //     });

    //     if (this.regularFilled.editRateType === "REGULAR") {
    //       this.updateRegularRate({
    //         data: this.payload,
    //         regularRefNum: this.regularFilled.regurlarRateRefNum,
    //         roomTypeRefNum: this.regularFilled.roomRefNum,
    //       })
    //         .then(() => {
    //           this.$refs.editRateForm.reset();
    //         })
    //         .catch((error) => {
    //           console.error("Error updating regular rates: ", error);
    //         })
    //         .finally(() => {
    //           this.$emit("reset-activator");
    //         });
    //     } else {
    //       this.updateSpecialRate({
    //         data: this.payload,
    //         specialRefNum: this.regularFilled.specialRateRefNum,
    //         roomTypeRefNum: this.regularFilled.roomRefNum,
    //       })
    //         .then(() => {
    //           this.$refs.editRateForm.resetValidation();
    //           this.$refs.editRateForm.reset();
    //         })
    //         .catch((error) => {
    //           console.error("Error updating special rates: ", error);
    //         })
    //         .finally(() => {
    //           this.$emit("reset-activator");
    //         });
    //     }
    //   }
    // },
  },
  watch: {
    dialog: {
      handler: function (newVal) {
        if (!newVal) {
          this.$emit("reset-activator");
        }
      },
    },
    activator: {
      handler: function (newVal) {
        this.dialog = newVal;
      },
    },
    rateMeta: {
      handler: function (newVal) {
        this.requestRateTypes(newVal);
      },
    },
    rateType: {
      deep: true,
      handler: function (newVal) {
        this.assignRateTypes(newVal);
      },
    },
    specialRateTypes: {
      handler: function (newVal) {
        console.log(newVal);
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
