<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Guest Name </template>
    </title-slot>

    <div>
      <label-slot>
        <template v-slot:label> First Name </template>
      </label-slot>
      <v-text-field dense hide-details="auto" outlined :rules="rules.firstName"></v-text-field>
    </div>

    <div class="my-4">
      <label-slot>
        <template v-slot:label> Middle Name </template>
      </label-slot>
      <v-text-field dense hide-details="auto" outlined></v-text-field>
    </div>

    <div>
      <label-slot>
        <template v-slot:label> Last Name </template>
      </label-slot>
      <v-text-field dense hide-details="auto" outlined :rules="rules.lastName"></v-text-field>
    </div>
  </div>
</template>

<script>
import LabelSlot from "./slots/LabelSlot.vue";
import TitleSlot from "./slots/TitleSlot.vue";
export default {
  name: "GuestNameTemplate",
  data: () => ({
    payload: {
      firstName: null,
      middleName: null,
      lastName: null,
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
      errors.firstName = [(v) => !!v || "First name is required"];
      errors.lastName = [(v) => !!v || "Last name is required"];
      return errors;
    },
  },
};
</script>

<style scoped></style>
