<template>
  <div>
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
export default {
  name: "ConfirmedDetails",
  props: ["queryResult"],
  data: () => ({
    payload: {},
    activeButtonTitle: "Save Check-In Time",
  }),
  components: {
    HeaderBookingSlot,
    BookingSummary,
    CheckInOutDetails,
  },
  methods: {
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    requestUpdateOnTime: function () {
      //API Calls
      if (!this.payload.checkIn.official) {
        this.payload.checkIn.official = new Date();
        this.activeButtonTitle = "Save Checked-Out Time";
        this.payload.status = "Checked-in";
      } else {
        this.payload.checkOut.official = new Date();
        this.payload.status = "Checked-out";
      }
    },
  },
  computed: {
    headerData() {
      let status = {};
      let button = {};
      let disabled = true;

      const now = new Date();
      const from = new Date(this.payload.checkIn.date);
      const to = new Date(this.payload.checkOut.date);

      if (this.payload.status === "Confirmed" && from <= now) {
        disabled = false;
      } else if (this.payload.status === "Checked-in" && to <= now) {
        disabled = false;
      }

      status.type = this.payload.status;
      button.title = this.activeButtonTitle;
      button.style = {
        color: "primary",
        outlined: false,
      };
      button.disabled = disabled;

      return {
        client: `${this.payload.lastName}, ${this.payload.firstName} ${
          this.payload.middleName ? this.payload.middleName : ""
        }`,
        from: {
          date: this.payload.checkIn.date,
        },
        to: {
          date: this.payload.checkOut.date,
        },
        status: status,
        button: button,
      };
    },
    cardInformation() {
      return {
        type: this.payload.room.type,
        roomName: this.payload.room.roomName,
        client: `${this.payload.lastName}, ${this.payload.firstName} ${
          this.payload.middleName ? this.payload.middleName : ""
        }`,
        button: {
          title: "Print",
          outlined: true,
        },
      };
    },
    cardTimeInformation() {
      return {
        checkIn: this.payload.checkIn,
        checkOut: this.payload.checkOut,
      };
    },
  },
  watch: {
    queryResult: {
      immediate: true,
      handler: function (newVal) {
        this.assignPayload(newVal);
        if (newVal.status === "For Reservation & Confirmation") {
          this.payload.status = "Confirmed";
        }
      },
    },
  },
};
</script>

<style scoped></style>
