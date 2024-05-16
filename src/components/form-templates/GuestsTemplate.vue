<template>
  <div class="pb-8">
    <v-form>
      <title-slot>
        <template v-slot:title> Guests </template>
      </title-slot>

      <div>
        <label-slot>
          <template v-slot:label> Extra Person </template>
        </label-slot>
        <v-text-field
          type="number"
          dense
          hide-details="auto"
          outlined
        ></v-text-field>
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
