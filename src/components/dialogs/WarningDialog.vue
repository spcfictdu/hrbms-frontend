<template>
  <v-dialog max-width="450" v-model="dialog" overlay-opacity="0.2">
    <v-form ref="form">
      <v-card class="pa-8" rounded="lg" flat>
        <v-card-title
          class="transparent-bg text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-uppercase pa-0"
          >Please Note</v-card-title
        >
        <p class="py-2 py-sm-4 text-caption text-sm-body-2 font-weight-regular">
          This reservation is a <strong>“Pencil Booking”</strong> and does not
          secure your reservation. Others may still book the room by paying it
          first. To ensure your reservation, we recommend completing the
          payment.
        </p>
        <v-card-actions class="pa-0 mt-4">
          <v-row dense justify="center" justify-sm="end">
            <v-col cols="12" sm="auto" order="last" order-sm="first"
              ><v-btn block outlined color="primary" @click="notRegisterButton"
                >Maybe Later</v-btn
              ></v-col
            >
            <v-col cols="12" sm="auto"
              ><v-btn block depressed color="primary" @click="registerButton"
                >Register Now</v-btn
              ></v-col
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "WarningDialog",
  props: {
    activator: Boolean,
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    notRegisterButton: function () {
      this.$emit("change-event", "MAYBE");
    },
    registerButton: function () {
      this.$emit("change-event", "REGISTER");
    },
  },
  computed: {},
  watch: {
    activator: {
      handler: function (newVal) {
        this.dialog = newVal;
      },
    },
    dialog: {
      handler: function (newVal) {
        if (!newVal) {
          this.$emit("reset-activator");
        }
      },
    },
  },
};
</script>

<style scoped></style>
