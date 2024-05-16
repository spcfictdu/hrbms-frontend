<template>
  <div class="pb-8">
    <v-form>
      <title-slot>
        <template v-slot:title> Payment </template>
      </title-slot>

      <v-row>
        <v-col cols="12" md="6">
          <v-btn
            text
            block
            color="black"
            height="100%"
            class="lightBg font-weight-regular text-capitalize py-2"
            ><v-avatar color="white" size="30" class="mr-2">
              <v-icon color="primary" dense>mdi-cash</v-icon> </v-avatar
            >Cash</v-btn
          >
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            text
            block
            color="black"
            height="100%"
            class="lightBg font-weight-regular text-capitalize py-2"
            ><v-avatar color="white" size="30" class="mr-2">
              <v-img contain width="20" height="20" :src="imgSrc"></v-img> </v-avatar
            >GCash</v-btn
          >
        </v-col>
      </v-row>

      <div class="mt-4">
        <label-slot>
          <template v-slot:label> Amount Received </template>
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
      type: null,
      amountReceived: null,
    },
    imgSrc: require("@/assets/GCashLogo.png"),
  }),
  components: {
    TitleSlot,
    LabelSlot,
  },
  methods: {},
};
</script>

<style scoped></style>
