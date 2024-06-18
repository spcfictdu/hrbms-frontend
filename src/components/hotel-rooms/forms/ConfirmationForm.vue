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
          <payment-template
            @emit-transaction="assignPayload"
            :isGreater="totalPayment"
          />

          <!-- GCash QR Code Transition -->
          <g-cash-image-transition :showScan="showScan" />
        </v-col>
        <v-col cols="12" md="6">
          <!-- Booking Summary -->
          <v-divider />
          <booking-summary
            :isStatus="payload.status"
            :cardInformation="cardInformation"
            @validation-event="requestUpdateOnTransaction"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import TransactionTemplate from "@/components/form-templates/TransactionTemplate.vue";
import HeaderBookingSlot from "../../slots/HeaderBookingSlot.vue";
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
    totalPayment: 0,
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
    requestUpdateOnTransaction: function () {
      // Assign Variables
      const referenceNumber = this.result.transaction.referenceNumber;
      let payload = {
        referenceNumber: referenceNumber,
        paymentType: this.payload.payment.paymentType,
        amountReceived: this.payload.payment.amountReceived,
        status: this.result.transaction.status,
      };

      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.$emit("validation-event", payload);
      }
    },
    requestCancel: function () {
      let params = {
        status: this.result.transaction.status,
        transactionRefNum: this.result.transaction.referenceNumber,
      };
      this.$emit("delete-event", params);
    },
    fetchQuery: function () {
      const transaction = this.result.transaction;
      const room = this.result.room;
      let query = {
        roomType: room.name,
        roomNumber: room.number,
      };

      if (transaction.checkInDate && transaction.checkOutDate) {
        query.dateRange = [transaction.checkInDate, transaction.checkOutDate];
      } else {
        delete query.dateRange;
      }
      if (transaction.extraPerson) {
        query.extraPersonCount = transaction.extraPerson;
      } else {
        delete query.extraPersonCount;
      }

      this.fetchRoom(query);
    },
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    headerData() {
      let status = {};
      let button = {};

      // Manipulate Button and Title Styling
      status.type = this.result.transaction.status;
      button.title = "Cancel Reservation";
      button.style = {
        color: "warning",
        outlined: true,
      };

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
      return this.payload.payment?.paymentType === "GCASH" ? true : false;
    },
    cardInformation() {
      const room = this.room ? this.room[0] : null;

      // Total Bill
      const total = room.roomTotalWithExtraPerson;
      this.totalPayment = total;

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
          extraPersonTotal: room.extraPersonTotal,
          total: room.roomTotalWithExtraPerson,
          roomRatesArray: room.roomRatesArray,
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
          this.fetchQuery();
        }
      },
    },
    payload: {
      deep: true,
      handler: function (newVal) {
        console.log(newVal);
      }
    }
  },
};
</script>

<style scoped></style>
