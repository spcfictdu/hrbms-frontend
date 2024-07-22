<template>
  <v-dialog v-model="dialog" max-width="600" overlay-opacity="0.2">
    <v-form ref="form" lazy-validation>
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0 mb-4"
          >{{ rateMeta.typeOfAction }} {{ rateMeta.roomType }} Rooms
          {{ rateMeta.rateType }} Rate
        </v-card-title>

        <!-- Special Rate -->
        <div v-if="rateMeta.rateType === permissions.specialRateInputs">
          <v-row>
            <v-col
              cols="12"
              v-if="permissions.specialRates.includes(rateMeta.typeOfAction)"
            >
              <label-slot>
                <template #label> Special Rates </template>
              </label-slot>
              <v-autocomplete
                hide-details="auto"
                outlined
                dense
                :items="specialRateTypes"
                item-text="referenceNumber"
                v-model="specialRateSelection"
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
                :readonly="readOnlyLock"
                :rules="rules.discountName"
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
                    :value="formatDate(startDate)"
                    v-on="on"
                    v-bind="attrs"
                    outlined
                    dense
                    readonly
                    hide-details="auto"
                    :rules="rules.startDate"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  :min="minDate"
                  @input="menuStart = false"
                  :readonly="readOnlyLock"
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
                    :value="formatDate(endDate)"
                    v-on="on"
                    v-bind="attrs"
                    outlined
                    dense
                    readonly
                    hide-details="auto"
                    :rules="rules.endDate"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  :min="minDate"
                  @input="menuEnd = false"
                  :readonly="readOnlyLock"
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
                v-model.number="day.rate"
                type="number"
                :rules="rules.rate"
                :readonly="readOnlyLock"
            /></v-col>
          </v-row>
        </div>

        <v-card-actions class="mt-4 pa-0">
          <v-row dense>
            <v-col cols="12" sm="6" order="last" order-sm="first">
              <v-btn block text color="warning" @click="cancelButton"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                block
                text
                color="primary"
                class="lightBg"
                :loading="rateMeta.loading"
                @click="submitButton"
                >{{ titleForSubmitButton }}</v-btn
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
import { format, parseISO } from "date-fns";
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
    // Meta
    dialog: false,
    minDate: new Date().toISOString().slice(0, 10),
    menuStart: false,
    menuEnd: false,
    permissions: {
      specialRates: ["DELETE", "EDIT"],
      specialRateInputs: "special",
    },

    // Special and Regular Rate Selection
    specialRateSelection: null,
    localRateTypes: null,

    // Local Payload
    referenceNumber: null,
    discountName: null,
    startDate: null,
    endDate: null,
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
      const meta = this.rateMeta;
      const allowedTypeOfAction = ["EDIT", "DELETE"];
      return meta.rateType === "special" &&
        allowedTypeOfAction.includes(meta.typeOfAction) &&
        this.rateType
        ? this.rateType.map((key) => ({
            discountName: key.discountName,
            referenceNumber: key.referenceNumber,
          }))
        : [];
    },
    readOnlyLock: function () {
      const meta = this.rateMeta;
      return meta.typeOfAction === "DELETE" && meta.rateType === "special"
        ? true
        : false;
    },
    titleForSubmitButton: function () {
      const meta = this.rateMeta;
      const allowedTypeOfAction = ["EDIT", "ADD"];
      return allowedTypeOfAction.includes(meta.typeOfAction)
        ? "Save Changes"
        : "Proceed";
    },
    rules() {
      let errors = {};
      const allowedTypeOfAction = ["EDIT", "ADD"];

      if (allowedTypeOfAction.includes(this.rateMeta.typeOfAction)) {
        errors.discountName = [(v) => !!v || "Discount name is required"];
        errors.startDate = [(v) => !!v || "Starting discount date is required"];
        errors.endDate = [(v) => !!v || "Ending discount date is required"];
        errors.rate = [(v) => !!v || "Rate is required"];
      }

      return errors;
    },
  },
  methods: {
    ...mapActions("rateTypeEnum", ["fetchRateType"]),
    formatDate: function (date) {
      return date ? format(parseISO(date), "MMMM dd, yyyy") : null;
    },
    cancelButton: function () {
      this.$emit("reset-activator");
      this.resetRateTypes();
    },
    requestRateTypes: function (meta) {
      const allowedTypeOfAction = ["EDIT", "DELETE"];
      if (allowedTypeOfAction.includes(meta.typeOfAction)) {
        this.fetchRateType({
          roomType: meta.roomType,
          rateType: meta.rateType,
        });
      }
    },
    assignRateTypes: function () {
      let pricingData = null;

      if (this.rateMeta.rateType === "regular") {
        pricingData = this.localRateTypes[0];
        this.referenceNumber = pricingData.referenceNumber;
      } else {
        pricingData = this.localRateTypes.find(
          (key) => key.referenceNumber === this.specialRateSelection
        );

        this.discountName = pricingData.discountName;
        this.startDate = pricingData.startDate;
        this.endDate = pricingData.endDate;
        this.referenceNumber = pricingData.referenceNumber;
      }

      if (pricingData) {
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
      }
    },
    resetRateTypes: function () {
      this.rates.forEach((key) => {
        key.rate = null;
      });

      this.specialRateSelection = null;
      this.discountName = null;
      this.startDate = null;
      this.endDate = null;

      this.$refs.form.reset();
    },
    reassignRateTypes: function () {
      let newVal = {};
      this.rates.forEach((key) => {
        switch (key.day) {
          case "Sunday":
            newVal.sunday = key.rate;
            break;
          case "Monday":
            newVal.monday = key.rate;
            break;
          case "Tuesday":
            newVal.tuesday = key.rate;
            break;
          case "Wednesday":
            newVal.wednesday = key.rate;
            break;
          case "Thursday":
            newVal.thursday = key.rate;
            break;
          case "Friday":
            newVal.friday = key.rate;
            break;
          case "Saturday":
            newVal.saturday = key.rate;
            break;
        }
      });
      return newVal;
    },
    submitButton: function () {
      const meta = this.rateMeta;
      const discountName = this.discountName;
      const startDate = this.startDate;
      const endDate = this.endDate;
      const referenceNumber = this.referenceNumber;

      let payload = {};
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        if (meta.typeOfAction === "ADD" && meta.rateType === "special") {
          payload = {
            status: "ADD",
            type: "SPECIAL",
            roomType: meta.roomType,
            discountName: discountName,
            startDate: startDate,
            endDate: endDate,
            rates: this.reassignRateTypes(),
          };
        } else if (
          meta.typeOfAction === "DELETE" &&
          meta.rateType === "special"
        ) {
          payload = {
            status: "DELETE",
            type: "SPECIAL",
            referenceNumber: referenceNumber,
          };
        } else if (
          meta.typeOfAction === "EDIT" &&
          meta.rateType === "regular"
        ) {
          payload = {
            status: "UPDATE",
            type: "REGULAR",
            referenceNumber: referenceNumber,
            rates: this.reassignRateTypes(),
          };
        } else if (
          meta.typeOfAction === "EDIT" &&
          meta.rateType === "special"
        ) {
          payload = {
            status: "UPDATE",
            type: "SPECIAL",
            referenceNumber: referenceNumber,
            discountName: discountName,
            startDate: startDate,
            endDate: endDate,
            rates: this.reassignRateTypes(),
          };
        }
        this.$emit("validation-event", payload);
      }
    },
  },
  watch: {
    dialog: {
      handler: function (newVal) {
        if (!newVal) {
          this.$emit("reset-activator");
        } else {
          this.resetRateTypes();
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
        this.localRateTypes = newVal;
        this.assignRateTypes();
      },
    },
    specialRateSelection: {
      deep: true,
      handler: function (newVal) {
        if (newVal) {
          this.assignRateTypes();
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
