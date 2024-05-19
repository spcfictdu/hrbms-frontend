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
              :value="payload.date"
              :rules="rules.date"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="payload.date"
            :min="minDate"
            @change="menu = false"
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
              :value="payload.time"
              :rules="rules.time"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="payload.time"
            scrollable
            active-picker="HOUR"
            @change="menu_2 = false"
          ></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LabelSlot from "./slots/LabelSlot.vue";
import TitleSlot from "./slots/TitleSlot.vue";
export default {
  name: "CheckOutTemplate",
  data: () => ({
    payload: {
      date: null,
      time: null,
    },
    menu: false,
    menu_2: false,
    minDate: new Date().toISOString().slice(0, 10),
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
  computed: {
    rules() {
      const errors = {};
      errors.date = [(v) => !!v || "Date is required"];
      errors.time = [(v) => !!v || "Time is required"];
      return errors;
    },
  },
};
</script>

<style scoped></style>
