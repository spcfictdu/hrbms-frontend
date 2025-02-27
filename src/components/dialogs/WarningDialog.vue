<template>
  <DialogTemplate
    title="Please Note"
    maxWidth="450"
    :opened="opened"
    :onClose="onClose"
  >
    <p class="py-2 py-sm-4 text-caption text-sm-body-2 font-weight-regular">
      This reservation is a <strong>“Pencil Booking”</strong> and does not
      secure your reservation. Others may still book the room by paying it
      first. To ensure your reservation, we recommend completing the payment.
    </p>
    <v-card-actions class="pa-0 mt-4">
      <v-row dense justify="center" justify-sm="end">
        <v-col cols="12" sm="auto" order="last" order-sm="first"
          ><v-btn block outlined color="primary" @click="handleMaybeLater"
            >Maybe Later</v-btn
          ></v-col
        >
        <v-col cols="12" sm="auto"
          ><v-btn block depressed color="primary" @click="handleRegister"
            >Register Now</v-btn
          ></v-col
        >
      </v-row>
    </v-card-actions>
  </DialogTemplate>
</template>

<script>
import DialogTemplate from "./DialogTemplate.vue";
export default {
  name: "WarningDialog",
  components: {
    DialogTemplate,
  },
  props: {
    opened: Boolean,
    onClose: Function,
  },
  data: () => ({}),
  methods: {
    handleMaybeLater: function () {
      this.$emit("onDecision", "MAYBE");
    },
    handleRegister: function () {
      this.$emit("onDecision", "REGISTER");
    },
  },
  computed: {},
};
</script>

<style scoped></style>
