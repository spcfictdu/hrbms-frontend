<template>
  <div>
    <header-booking-slot @button-event="headerEvents" :headerData="headerData">
    </header-booking-slot>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Transaction -->
          <v-divider />
          <transaction-template
            :statuses="statuses"
            @emit-transaction="assignPayload"
          />

          <!-- Payment -->
          <v-divider />
          <payment-template @emit-transaction="assignPayload" />

          <!-- GCash QR Code Transition -->
          <g-cash-image-transition :showScan="showScan" />
        </v-col>
        <v-col cols="12" md="6">
          <!-- Booking Summary -->
          <v-divider />
          <booking-summary
            :isStatus="payload.status"
            :cardInformation="cardInformation"
            @validation-event="submitForValidation"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import TransactionTemplate from "@/components/form-templates/TransactionTemplate.vue";
import HeaderBookingSlot from "../../../components/slots/HeaderBookingSlot.vue";
import PaymentTemplate from "@/components/form-templates/PaymentTemplate.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import GCashImageTransition from "./GCashImageTransition.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "ConfirmationForm",
  props: ["result"],
  data: () => ({
    payload: {},
    statuses: [
      {
        status: "For Reservation & Confirmation",
        value: "CONFIRMED",
      },
    ],
    roomTotal: 2000,
    extraPersonTotal: 0,
    total: 2000,
    totalOutstanding: 2000,
  }),
  components: {
    HeaderBookingSlot,
    TransactionTemplate,
    PaymentTemplate,
    BookingSummary,
    GCashImageTransition,
  },
  methods: {
    ...mapActions("roomEnum", ["fetchRoom"]),
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    submitForValidation: function () {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        // // API request
        // this.$router.push({
        //   name: "CheckInOut",
        //   query: {
        //     payload: JSON.stringify(this.payload),
        //   },
        // });
      }
    },
    headerEvents: function () {
      // Cancel Reservation
    },
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    headerData() {
      let status = {};
      let button = {};
      if (this.result.transaction.status === "RESERVED") {
        status.type = "Reserved"; // May Change
        button.title = "Cancel Reservation";
        button.style = {
          color: "warning",
          outlined: true,
        };
      }
      return {
        client: this.result.guestName,
        from: {
          date: `${this.result.transaction.checkInDate}T${this.result.transaction.checkInTime}`,
        },
        to: {
          date: `${this.result.transaction.checkOutDate}T${this.result.transaction.checkOutTime}`,
        },
        status: status,
        button: button,
      };
    },
    showScan() {
      return this.payload.payment?.paymentType === "GCash" ? true : false;
    },
    cardInformation() {
      const additionalGuests = this.payload.guests
      const totalReceived = this.payload.payment?.amountReceived
        ? this.payload.payment.amountReceived
        : 0;
      const totalOutstanding = this.totalOutstanding - totalReceived;

      return {
        client: this.result.guestName,
        room: {
          type: this.result.room.name,
          roomName: this.result.room.number,
          capacity: this.result.room.capacity,

        },
        payment: {
          roomTotal: this.roomTotal,
          extraPersonTotal: this.extraPersonTotal,
          total: this.total,
          totalReceived: totalReceived,
          totalOutstanding: totalOutstanding,
        },
        button: {
          title: "Record Payment",
          outlined: false,
        },
      };
    },
  },
  watch: {
    result: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          let query = {
            "room-number": newVal.room.number,
          }
          this.fetchRoom(query);
        }
      },
    },
  },
};
</script>

<style scoped></style>
