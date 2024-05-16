<template>
  <div class="pb-8">
    <v-form>
      <title-slot>
        <template v-slot:title> ID </template>
      </title-slot>

      <v-row>
        <v-col cols="12" md="6">
          <label-slot>
            <template v-slot:label> Type </template>
          </label-slot>
          <v-select
            hide-details="auto"
            outlined
            dense
            :items="IdEnums"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <label-slot>
            <template v-slot:label> ID Number </template>
          </label-slot>
          <v-text-field dense hide-details="auto" outlined></v-text-field>
        </v-col>
      </v-row>
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
      phoneNumber: null,
      email: null,
    },
    IdEnums: ["National ID", "Driver's License", "Passport"],
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
};
</script>

<style scoped></style>
