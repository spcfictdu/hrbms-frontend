<template>
  <FormSection title="Check Out">
    <v-row>
      <v-col cols="12" md="6">
        <FormField label="Date">
          <DateField
            :minDate="minDate"
            :model="payload.checkOut.date"
            :rules="rules.date"
            @input="(v) => evaluateValue(v, 'date')"
          />
        </FormField>
      </v-col>
      <v-col cols="12" md="6">
        <FormField label="Time">
          <TimeField
            :disabled="!isDisabled"
            :model="payload.checkOut.time"
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
  name: "CheckOutTemplate",
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
      checkOut: {
        date: null,
        time: null,
      },
    },
    minDate: new Date().toISOString().slice(0, 10),
  }),

  methods: {
    emitTransaction: function () {
      this.$emit("emit-transaction", this.payload);
    },
    evaluateValue: function (v, key) {
      this.payload.checkOut[key] = v;
    },
  },
  computed: {
    rules: function () {
      const errors = {};
      errors.date = [(v) => !!v || "Date is required"];
      errors.time = [(v) => !!v || "Time is required"];
      return errors;
    },
    isDisabled: function () {
      return this.$auth.user()?.role !== "ADMIN" ? true : false;
    },
  },
  watch: {
    fill: {
      immediate: true,
      handler: function (newVal) {
        if (newVal?.checkOutDate || newVal?.checkOutTime) {
          this.payload.checkOut.date = newVal.checkOutDate;
          this.payload.checkOut.time = newVal?.checkOutTime;
          this.$emit("emit-transaction", this.payload);
        } else {
          this.payload.checkOut.date = null;
          this.payload.checkOut.time = null;
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
