<template>
  <FormSection title="Check In">
    <v-row>
      <v-col cols="12" md="6">
        <FormField label="Date">
          <DateField
            :model="payload.checkIn.date"
            :rules="rules.date"
            :minDate="minDate"
            @input="(v) => evaluateValue(v, 'date')"
          />
        </FormField>
      </v-col>
      <v-col cols="12" md="6">
        <FormField label="Time">
          <TimeField
            :model="payload.checkIn.time"
            :disabled="!isDisabled"
            :rules="rules.time"
            @input="(v) => evaluateValue(v, 'time')"
          />
        </FormField>
      </v-col>
    </v-row>
  </FormSection>
</template>

<script>
import FormSection from "../sections/FormSection.vue";
import FormField from "../fields/FormField.vue";
import DateField from "../fields/DateField.vue";
import TimeField from "../fields/TimeField.vue";
export default {
  name: "CheckInTemplate",
  components: {
    FormSection,
    FormField,
    DateField,
    TimeField,
  },
  props: {
    fill: Object,
  },
  data: () => ({
    payload: {
      checkIn: {
        date: null,
        time: null,
      },
    },
    minDate: new Date().toISOString().slice(0, 10),
  }),
  methods: {
    emitTransaction: function () {
      // // Format Date
      // let dateString = `${this.date}T${this.time}:00`;
      // this.payload.checkIn.date = dateString;
      this.$emit("emit-transaction", this.payload);
    },
    evaluateValue: function (v, key) {
      this.payload.checkIn[key] = v;
    },
  },
  computed: {
    rules() {
      const errors = {};
      errors.date = [(v) => !!v || "Date is required"];
      errors.time = [(v) => !!v || "Time is required"];
      return errors;
    },
    formattedTime() {
      //Show the time in another format
      const now = new Date().toISOString().slice(0, 10);
      const dateString = `${now}T${this.payload.checkIn.time}:00`;
      return this.payload.checkIn.time ? this.formatTime(dateString) : null;
    },
    isDisabled: function () {
      return this.$auth.user()?.role !== "ADMIN" ? true : false;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.checkInDate || newVal?.checkInTime) {
          this.payload.checkIn.date = newVal.checkInDate;
          this.payload.checkIn.time = newVal?.checkInTime;
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.checkIn.date = null;
          this.payload.checkIn.time = null;
        }
      },
    },
    payload: {
      deep: true,
      handler: function () {
        this.emitTransaction();
      },
    },
  },
};
</script>

<style scoped></style>
