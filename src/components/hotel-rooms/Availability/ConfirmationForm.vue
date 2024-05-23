<template>
  <div v-if="room">
    <header-booking-slot @button-event="requestCancel" :headerData="headerData">
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
    payload: {
      payment: {
        amountReceived: 0,
        paymentType: null,
      },
    },
    statuses: [
      {
        status: "For Reservation & Confirmation",
        value: "CONFIRMED",
      },
    ],
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
    requestCancel: function () {
      let params = {
        status: this.result.transaction.status,
        transactionRefNum: this.result.transaction.referenceNumber,
      };
      this.$emit("delete-event", params);
    },
    fetchQuery: function (newVal) {
      let query = {
        roomType: newVal.room.name,
        roomNumber: newVal.room.number,
      };
      this.fetchRoom(query);
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
      const room = this.room ? this.room[0] : null;

      // Assign the Guests to a variable
      const additionalGuests = this.payload.guests ? this.payload.guests : 0;

      // Compute the total additional guests price
      const extraPersonTotal = room.extraPersonTotal * additionalGuests;

      // Total Bill
      const total = room.roomTotal + room.extraPersonTotal * additionalGuests;

      // Total Received
      const totalReceived = this.payload.payment
        ? this.payload.payment.amountReceived
        : 0;

      // Total Outstanding Bill
      const totalOutstanding =
        total - totalReceived < 0 ? 0 : total - totalReceived;

      // Total Change
      const totalChange = totalReceived > total ? totalReceived - total : 0;

      return {
        client: this.result.guestName,
        room: {
          type: room.roomType,
          roomName: room.roomNumber,
          capacity: room.roomTypeCapacity,
          roomFloor: room.roomFloor,
        },
        payment: {
          roomTotal: room.roomTotal,
          extraPersonTotal: extraPersonTotal,
          total: total,
          totalReceived: totalReceived,
          totalOutstanding: totalOutstanding,
          totalChange: totalChange,
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
          this.fetchQuery(newVal);
        }
      },
    },
  },
};
</script>

<style scoped></style>
