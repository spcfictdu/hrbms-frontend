<template>
  <div v-if="room">
    <header-booking-slot
      @button-event="requestUpdateOnTime"
      :headerData="headerData"
    />

    <v-row>
      <v-col cols="12" md="6">
        <!-- Checked-in/out -->
        <v-divider />
        <check-in-out-details :cardTimeInformation="cardTimeInformation" />
      </v-col>
      <v-col cols="12" md="6">
        <!-- Booking Summary -->
        <v-divider></v-divider>
        <booking-summary
          :isStatus="payload.status"
          :cardInformation="cardInformation"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import HeaderBookingSlot from "@/components/slots/HeaderBookingSlot.vue";
import BookingSummary from "@/components/form-templates/BookingSummary.vue";
import CheckInOutDetails from "@/components/form-templates/CheckInOutDetails.vue";
import { mapActions, mapState } from "vuex";
import { format, parseISO } from "date-fns";
export default {
  name: "ConfirmedDetails",
  props: ["result"],
  data: () => ({
    payload: {
      status: null,
    },
    activeButtonTitle: "Save Check-In Time",
  }),
  components: {
    HeaderBookingSlot,
    BookingSummary,
    CheckInOutDetails,
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
    requestUpdateOnTime: function () {
      const history = this.result.transactionHistory;
      const referenceNumber = this.result.transaction.referenceNumber;
      let payload = {};
      const now = new Date().toISOString();

      if (!history.checkInDate && !history.checkInTime) {
        payload = {
          checkInDate: this.formatISODate(now),
          checkInTime: this.formatISOTime(now),
        };
      } else if (!history.checkOutDate && !history.checkOutTime) {
        payload = {
          checkOutDate: this.formatISODate(now),
          checkOutTime: this.formatISOTime(now),
        };
      }

      // Attached Final Values
      payload.referenceNumber = referenceNumber;
      this.$emit("update-event", payload);
    },
    fetchQuery: function (newVal) {
      let query = {
        roomType: newVal.room.name,
        roomNumber: newVal.room.number,
      };
      this.fetchRoom(query);
    },
    formatISODate: function (date) {
      return format(parseISO(date), "yyyy-MM-dd");
    },
    formatISOTime: function (date) {
      return format(parseISO(date), "HH:mm:ss");
    },
    updateButtonTitles(newVal) {
      if (newVal === "CHECKED-IN") {
        this.activeButtonTitle = "Save Checked-Out Time";
      } else {
        this.activeButtonTitle = "Save Checked-In Time";
      }
    },
  },
  computed: {
    ...mapState("roomEnum", ["room"]),
    headerData() {
      let status = {};
      let button = {};
      let disabled = true;
      const checkInDate = `${this.result.transaction.checkInDate}T${this.result.transaction.checkInTime}`;
      const checkOutDate = `${this.result.transaction.checkOutDate}T${this.result.transaction.checkOutTime}`;

      const now = new Date();
      const from = new Date(checkInDate);
      const to = new Date(checkOutDate);

      if (this.result.transaction.status === "CONFIRMED" && from <= now) {
        disabled = false;
      } else if (this.result.transaction.status === "CHECKED-IN" && to <= now) {
        disabled = false;
      }

      status.type = this.result.transaction.status;
      button.title = this.activeButtonTitle;
      button.style = {
        color: "primary",
        outlined: false,
      };
      button.disabled = disabled;

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
          title: "Print",
          outlined: true,
        },
      };
    },
    cardTimeInformation() {
      const transactionHistory = this.result.transactionHistory;
      let checkIn = null;
      let checkOut = null;

      if (transactionHistory.checkInDate && transactionHistory.checkInTime) {
        checkIn = `${transactionHistory.checkInDate}T${transactionHistory.checkInTime}`;
      }
      if (transactionHistory.checkOutDate && transactionHistory.checkOutTime) {
        checkOut = `${transactionHistory.checkOutDate}T${transactionHistory.checkOutTime}`;
      }
      return {
        checkIn: checkIn,
        checkOut: checkOut,
      };
    },
  },
  watch: {
    result: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.fetchQuery(newVal);
          this.payload.status = newVal.transaction.status;
          this.updateButtonTitles(newVal.transaction.status);
        }
      },
    },
  },
};
</script>

<style scoped></style>
