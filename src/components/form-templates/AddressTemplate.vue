<template>
  <div class="pb-8">
    <v-form>
      <title-slot>
        <template v-slot:title> Address </template>
      </title-slot>

      <div>
        <label-slot>
          <template v-slot:label> Province </template>
        </label-slot>
        <v-text-field dense hide-details="auto" outlined></v-text-field>
      </div>

      <div class="mt-4">
        <label-slot>
          <template v-slot:label> City/Municipality </template>
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
      province: null,
      cityMunicipality: null,
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
