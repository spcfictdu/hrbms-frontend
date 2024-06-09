<template>
  <div>
    <p class="d-block d-sm-none text-overline font-weight-bold">
      Reservation Form
    </p>
    <v-card flat class="pa-6">
      <v-form lazy-validation ref="form">
        <div class="pb-4">
          <label-slot>
            <template v-slot:label> Check-in Date </template>
          </label-slot>
          <v-text-field
            :rules="rules.checkInDate"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </div>

        <div class="pb-4">
          <label-slot>
            <template v-slot:label> Check-out Date </template>
          </label-slot>
          <v-text-field
            :rules="rules.checkOutDate"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </div>

        <v-divider class="mt-4" />
        <p class="mt-1 mb-2 text-caption font-weight-black font-italic">
          Reservation has no charge
        </p>

        <div class="my-3 text-subtitle-2 font-weight-regular">
          <div class="d-flex justify-space-between align-center">
            <div>Room Total:</div>
            <div>₱ 2000</div>
          </div>

          <div class="d-flex justify-space-between align-center">
            <div>Duration:</div>
            <div>2 days</div>
          </div>

          <div
            class="d-flex justify-space-between align-center primary--text font-weight-bold"
          >
            <div>Total:</div>
            <div>₱ 2000</div>
          </div>
        </div>

        <v-card-actions class="px-0 pb-0 pt-4">
          <v-btn block color="primary" @click="requestReservation">Make Reservation</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import LabelSlot from "@/components/slots/LabelSlot.vue";
export default {
  name: "RoomReservationForm",
  components: { LabelSlot },
  data: () => ({}),
  methods: {
    requestReservation: function () {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        console.log("Reservation Made");
      }
    }
  },
  computed: {
    rules: function () {
      let errors = {};
      errors.checkInDate = [(v) => !!v || "Check-in Date is required"];
      errors.checkOutDate = [(v) => !!v || "Check-out Date is required"];
      return errors;
    },
  },
};
</script>

<style scoped></style>
