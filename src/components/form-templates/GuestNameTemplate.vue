<template>
  <div class="pb-8">
    <v-form>
      <title-slot>
        <template v-slot:title> Guest Name </template>
      </title-slot>

      <div>
        <label-slot>
          <template v-slot:label> First Name </template>
        </label-slot>
        <v-text-field dense hide-details="auto" outlined></v-text-field>
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
        <v-text-field dense hide-details="auto" outlined></v-text-field>
      </div>
    </v-form>
  </div>
</template>

<script>
import LabelSlot from "./slots/LabelSlot.vue";
import TitleSlot from "./slots/TitleSlot.vue";
export default {
  name: "TransactionTemplate",
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
};
</script>

<style scoped></style>
