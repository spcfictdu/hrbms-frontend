<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Contact Details </template>
    </title-slot>

    <v-row>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Phone Number </template>
        </label-slot>
        <v-text-field
          type="number"
          dense
          hide-details="auto"
          outlined
          :rules="rules.phoneNumber"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <label-slot>
          <template v-slot:label> Email </template>
        </label-slot>
        <v-text-field
          type="email"
          dense
          hide-details="auto"
          outlined
          :rules="rules.email"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LabelSlot from "./slots/LabelSlot.vue";
import TitleSlot from "./slots/TitleSlot.vue";
export default {
  name: "ContactDetailsTemplate",
  data: () => ({
    payload: {
      phoneNumber: null,
      email: null,
    },
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
  computed: {
    rules() {
      const errors = {};
      errors.phoneNumber = [(v) => !!v || "Phone number is required"];
      errors.email = [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ];
      return errors;
    },
  },
};
</script>

<style scoped></style>
