<template>
  <DialogTemplate
    maxWidth="600"
    :action="rateMeta.action"
    :title="`${rateMeta.roomType} ${rateMeta.rateType} Rate`"
    :opened="opened"
    :onClose="onClose"
  >
    <!-- Special Rate -->
    <div v-if="rateMeta.rateType === permissions.specialRateInputs">
      <v-row>
        <v-col
          cols="12"
          v-if="permissions.specialRates.includes(rateMeta.action)"
        >
          <FormField label="Special Rates">
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
          </FormField>
        </v-col>
        <v-col cols="12">
          <FormField label="Special Rate Name">
            <v-text-field
              hide-details="auto"
              outlined
              dense
              v-model="discountName"
              :readonly="readOnlyLock"
              :rules="rules.discountName"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6">
          <FormField label="Start Date">
            <DateField
              :minDate="minDate"
              :model="startDate"
              :rules="rules.startDate"
              :readonly="readOnlyLock"
              withFormat
              @input="startDate = $event"
            />
          </FormField>
        </v-col>
        <v-col cols="12" sm="6">
          <FormField label="End Date">
            <DateField
              :minDate="minDate"
              :model="endDate"
              :rules="rules.endDate"
              :readonly="readOnlyLock"
              withFormat
              @input="endDate = $event"
            />
          </FormField>
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
      <p class="d-flex d-sm-none text-overline font-weight-bold text-uppercase">
        Pricing
      </p>

      <v-row v-for="(day, index) in rates" :key="index" align="center">
        <v-col cols="6" class="d-none d-sm-flex">
          <span class="text-subtitle-2 font-weight-regular">{{ day.day }}</span>
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
          <v-btn block text color="warning" @click="cancelButton">Cancel</v-btn>
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
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
import FormField from "../fields/FormField.vue";
import DateField from "../fields/DateField.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "RateDialog",
  components: {
    DialogTemplate,
    FormField,
    DateField,
  },
  props: {
    opened: Boolean,
    onClose: Function,
    rateMeta: Object,
  },
  data: () => ({
    // Meta
    minDate: new Date().toISOString().slice(0, 10),
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
  methods: {
    ...mapActions("rateTypeEnum", ["fetchRateType"]),
    cancelButton: function () {
      this.onClose();
    },
    fetch: async function (meta) {
      console.log(meta);
      if (["EDIT", "DELETE"].includes(meta.action)) {
        console.log("Fetching Rate Type");
        await this.fetchRateType({
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
        this.rates = this.rates.map(({ day }) => ({
          day,
          rate: pricingData[day.toLowerCase()],
        }));
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
    },
    ratesReducer: function (rates) {
      return rates.reduce((acc, { day, rate }) => {
        acc[day.toLowerCase()] = rate;
        return acc;
      }, {});
    },
    submitButton: function () {
      const meta = this.rateMeta;
      const discountName = this.discountName;
      const startDate = this.startDate;
      const endDate = this.endDate;
      const referenceNumber = this.referenceNumber;

      let payload = {};

      if (meta.action === "ADD" && meta.rateType === "special") {
        payload = {
          status: "ADD",
          type: "SPECIAL",
          roomType: meta.roomType,
          discountName: discountName,
          startDate: startDate,
          endDate: endDate,
          rates: this.ratesReducer(this.rates),
        };
      } else if (meta.action === "DELETE" && meta.rateType === "special") {
        payload = {
          status: "DELETE",
          type: "SPECIAL",
          referenceNumber: referenceNumber,
        };
      } else if (meta.action === "EDIT" && meta.rateType === "regular") {
        payload = {
          status: "UPDATE",
          type: "REGULAR",
          referenceNumber: referenceNumber,
          rates: this.ratesReducer(this.rates),
        };
      } else if (meta.action === "EDIT" && meta.rateType === "special") {
        payload = {
          status: "UPDATE",
          type: "SPECIAL",
          referenceNumber: referenceNumber,
          discountName: discountName,
          startDate: startDate,
          endDate: endDate,
          rates: this.ratesReducer(this.rates),
        };
      }
      this.$emit("validation-event", payload);
    },
  },
  computed: {
    ...mapState("rateTypeEnum", ["rateType"]),
    size() {
      return this.$vuetify.breakpoint;
    },
    specialRateTypes: function () {
      const meta = this.rateMeta;
      const allowedTypeOfAction = ["EDIT", "DELETE"];
      return meta.rateType === "special" &&
        allowedTypeOfAction.includes(meta.action) &&
        this.rateType
        ? this.rateType.map((key) => ({
            discountName: key.discountName,
            referenceNumber: key.referenceNumber,
          }))
        : [];
    },
    readOnlyLock: function () {
      const meta = this.rateMeta;
      return meta.action === "DELETE" && meta.rateType === "special"
        ? true
        : false;
    },
    titleForSubmitButton: function () {
      const meta = this.rateMeta;
      return ["EDIT", "ADD"].includes(meta.action) ? "Save Changes" : "Proceed";
    },
    rules: function () {
      let errors = {};
      if (["EDIT", "ADD"].includes(this.rateMeta.action)) {
        errors.discountName = [(v) => !!v || "Discount name is required"];
        errors.startDate = [(v) => !!v || "Starting discount date is required"];
        errors.endDate = [(v) => !!v || "Ending discount date is required"];
        errors.rate = [(v) => !!v || "Rate is required"];
      }
      return errors;
    },
  },

  watch: {
    opened: {
      deep: true,
      handler: function (v) {
        if (!v) {
          this.resetRateTypes();
        }
      },
    },
    rateMeta: {
      deep: true,
      handler: function (v) {
        this.fetch(v);
      },
    },
    rateType: {
      deep: true,
      handler: function (v) {
        this.localRateTypes = v;
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
