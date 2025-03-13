<template>
  <DialogTemplate
    maxWidth="600"
    :action="rateMeta.action"
    :title="`${rateMeta.roomType} ${rateMeta.rateType} Rate`"
    :opened="opened"
    :onClose="onClose"
    @onSubmit="handleSubmit"
  >
    <!-- Special Rate -->
    <div v-if="rateMeta.rateType === 'special'">
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
              v-model="payload.discountName"
              :rules="rules.discountName"
              :readonly="isReadonly"
            ></v-text-field>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6">
          <FormField label="Start Date">
            <DateField
              :minDate="minDate"
              :model="payload.startDate"
              :rules="rules.startDate"
              :readonly="isReadonly"
              withFormat
              @input="payload.startDate = $event"
            />
          </FormField>
        </v-col>
        <v-col cols="12" sm="6">
          <FormField label="End Date">
            <DateField
              :minDate="minDate"
              :model="payload.endDate"
              :rules="rules.endDate"
              :readonly="isReadonly"
              withFormat
              @input="payload.endDate = $event"
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

      <v-row v-for="(rate, index) in payload.rates" :key="index" align="center">
        <v-col cols="6" class="d-none d-sm-flex">
          <span class="text-subtitle-2 font-weight-regular">{{
            rate.day
          }}</span>
        </v-col>
        <v-col cols="12" sm="6">
          <!-- Mobile Breakpoint -->
          <div class="d-flex d-sm-none text-caption ml-1 mb-1">
            {{ rate.day }}
          </div>

          <v-text-field
            outlined
            dense
            hide-details="auto"
            prefix="₱"
            v-model.number="rate.rate"
            type="number"
            :rules="rules.rate"
            :readonly="isReadonly"
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
            :loading="loading"
            type="submit"
            >{{ submitBtnTitle }}</v-btn
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
    loading: Boolean,
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

    // Local Payload
    payload: {
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
    },
  }),
  methods: {
    ...mapActions("rateTypeEnum", ["fetchRateType"]),
    cancelButton: function () {
      this.onClose();
    },
    fetch: async function (meta) {
      if (["EDIT", "DELETE"].includes(meta.action)) {
        await this.fetchRateType({
          roomType: meta.roomType,
          rateType: meta.rateType,
        });
      }
    },
    handleSubmit: function () {
      const meta = this.rateMeta;

      const payload = {
        action: meta.action === "EDIT" ? "UPDATE" : meta.action,
        type: meta.rateType.toUpperCase(),
        referenceNumber: this.payload.referenceNumber,
        data: {
          ...this.payload,
          roomType: meta.roomType,
          rates: this.ratesReducer(this.payload.rates),
        },
      };

      if (meta.action === "ADD" && meta.rateType === "special") {
        payload.data = this.keepOnlyKeys(payload.data, [
          "roomType",
          "discountName",
          "startDate",
          "endDate",
          "rates",
        ]);
      } else if (meta.action === "DELETE" && meta.rateType === "special") {
        payload.data = this.keepOnlyKeys(payload.data, []);
      } else if (meta.action === "EDIT" && meta.rateType === "regular") {
        payload.data = this.keepOnlyKeys(payload.data, ["rates"]);
      } else if (meta.action === "EDIT" && meta.rateType === "special") {
        payload.data = this.keepOnlyKeys(payload.data, [
          "rates",
          "discountName",
          "startDate",
          "endDate",
        ]);
      }
      this.$emit("validation-event", payload);
    },
    assignRateTypes: function () {
      let pricingData = null;

      if (this.rateMeta.rateType === "regular") {
        pricingData = this.rateType[0];
      } else {
        pricingData = this.rateType.find(
          (key) => key.referenceNumber === this.specialRateSelection
        );

        this.payload.discountName = pricingData.discountName;
        this.payload.startDate = pricingData.startDate;
        this.payload.endDate = pricingData.endDate;
      }

      if (pricingData) {
        this.payload.referenceNumber = pricingData.referenceNumber;
        this.payload.rates = this.payload.rates.map(({ day }) => ({
          day,
          rate: pricingData[day.toLowerCase()],
        }));
      }
    },
    resetRateTypes: function () {
      this.specialRateSelection = null;
      this.payload.discountName = null;
      this.payload.startDate = null;
      this.payload.endDate = null;
      this.payload.rates = this.payload.rates.map(({ day }) => ({
        day,
        rate: null,
      }));
    },
    ratesReducer: function (rates) {
      return rates.reduce((acc, { day, rate }) => {
        acc[day.toLowerCase()] = rate;
        return acc;
      }, {});
    },
    keepOnlyKeys(payload, keysToKeep) {
      const result = {};
      keysToKeep.forEach((key) => {
        if (key in payload) {
          result[key] = payload[key];
        }
      });
      return result;
    },
  },
  computed: {
    ...mapState("rateTypeEnum", ["rateType"]),
    size() {
      return this.$vuetify.breakpoint;
    },
    specialRateTypes: function () {
      const condition =
        this.rateMeta.rateType === "special" &&
        ["EDIT", "DELETE"].includes(this.rateMeta.action) &&
        this.rateType;
      return condition
        ? this.rateType.map((key) => ({
            discountName: key.discountName,
            referenceNumber: key.referenceNumber,
          }))
        : [];
    },
    isReadonly: function () {
      return (
        this.rateMeta.action === "DELETE" &&
        this.rateMeta.rateType === "special"
      );
    },
    submitBtnTitle: function () {
      return ["EDIT", "ADD"].includes(this.rateMeta.action)
        ? "Save Changes"
        : "Proceed";
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
      handler: async function (v) {
        await this.fetch(v);

        if (v.action === "EDIT" && v.rateType === "regular")
          this.assignRateTypes();
      },
    },
    specialRateSelection: {
      deep: true,
      handler: function (v) {
        if (v) {
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
