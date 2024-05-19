<template>
  <div class="pb-8">
    <title-slot>
      <template v-slot:title> Address </template>
    </title-slot>

    <div>
      <label-slot>
        <template v-slot:label> Province </template>
      </label-slot>
      <v-text-field dense hide-details="auto" outlined :rules="rules.province"></v-text-field>
    </div>

    <div class="mt-4">
      <label-slot>
        <template v-slot:label> City/Municipality </template>
      </label-slot>
      <v-text-field dense hide-details="auto" outlined :rules="rules.cityMunicipality"></v-text-field>
    </div>
  </div>
</template>

<script>
import LabelSlot from "./slots/LabelSlot.vue";
import TitleSlot from "./slots/TitleSlot.vue";
export default {
  name: "AddressTemplate",
  data: () => ({
    payload: {
      province: null,
      cityMunicipality: null,
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
      errors.province = [(v) => !!v || "Province is required"];
      errors.cityMunicipality = [(v) => !!v || "City/Municipality is required"];
      return errors;
    },
  },
};
</script>

<style scoped></style>
