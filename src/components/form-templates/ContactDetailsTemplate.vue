<template>
  <div class="pb-8">
    <v-form>
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
          ></v-text-field>
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
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
};
</script>

<style scoped></style>
