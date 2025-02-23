<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Check Out </template>
    </title-slot>

    <v-row>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Date </template>
        </label-slot>
        <v-menu
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
          v-model="menu"
          min-width="auto"
          max-width="290"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              outlined
              dense
              readonly
              hide-details="auto"
              :value="payload.checkOut.date"
              :rules="rules.date"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="payload.checkOut.date"
            :min="minDate"
            @change="emitDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Time </template>
        </label-slot>
        <v-menu
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
          min-width="auto"
          max-width="290"
          v-model="menu_2"
        >
          <template #activator="{ attrs, on }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              outlined
              dense
              readonly
              hide-details="auto"
              :value="formattedTime"
              :rules="rules.time"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="!isDisabled"
            v-model="payload.checkOut.time"
            scrollable
            active-picker="HOUR"
            @change="emitTime"
          ></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LabelSlot from "../slots/LabelSlot.vue";
import TitleSlot from "../slots/TitleSlot.vue";
import { formatTime } from "@/mixins/FormattingFunctions";
export default {
  name: "CheckOutTemplate",
  mixins: [formatTime],
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
    menu: false,
    menu_2: false,
    minDate: new Date().toISOString().slice(0, 10),
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {
    emitTransaction: function () {
      // // Format Date
      // let dateString = `${this.date}T${this.time}:00`;
      // this.payload.checkOut.date = dateString;
      this.$emit("emit-transaction", this.payload);
    },
    emitDate: function () {
      this.menu = false;
      this.emitTransaction();
    },
    emitTime: function () {
      this.menu_2 = false;
      this.emitTransaction();
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
      const dateString = `${now}T${this.payload.checkOut.time}:00`;
      return this.payload.checkOut.time ? this.formatTime(dateString) : null;
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
        }
      },
    },
  },
};
</script>

<style scoped></style>
