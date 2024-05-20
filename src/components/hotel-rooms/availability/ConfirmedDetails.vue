<template>
  <div>
    <header-booking-slot :headerData="headerData" />

    <v-row>
      <v-col cols="12" md="6">
        <!-- Checked-in/out -->
        <v-divider />
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
export default {
  name: "ConfirmedDetails",
  props: ["queryResult"],
  data: () => ({
    payload: {},
  }),
  components: {
    HeaderBookingSlot,
    BookingSummary,
  },
  methods: {
    formatDate(date) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `${formattedDate}`;
    },
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
  },
  computed: {
    headerData() {
      let status = {};
      let button = {};

      status.type = "Booking";
      status.color = "primary";
      button.title = "Save Checked-In Time";
      button.style = {
        color: "primary",
        outlined: false,
      };

      return {
        client: `${this.queryResult.lastName}, ${this.queryResult.firstName} ${
          this.queryResult.middleName ? this.queryResult.middleName : ""
        }`,
        from: {
          date: this.formatDate(this.queryResult.checkIn.date),
          time: this.queryResult.checkIn.time,
        },
        to: {
          date: this.formatDate(this.queryResult.checkOut.date),
          time: this.queryResult.checkOut.time,
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
  },
  watch: {
    queryResult: {
      immediate: true,
      handler: function (newVal) {
        this.assignPayload(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
