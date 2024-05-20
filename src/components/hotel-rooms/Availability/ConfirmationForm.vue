<template>
  <div>
    <header-booking-slot :headerData="headerData"> </header-booking-slot>
    <v-form>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Transaction -->
          <v-divider />
          <transaction-template @emit-transaction="assignPayload" />

          <!-- Payment -->
          <v-divider />
          <payment-template @emit-transaction="assignPayload" />

          <!-- GCash QR Code Transition -->
          <v-expand-transition>
            <div v-show="showScan" class="lightBg rounded-lg pa-6 text-center">
              <v-img
                eager
                class="mx-auto"
                :src="imgSrc"
                max-width="200"
              ></v-img>
            </div>
          </v-expand-transition>
        </v-col>
        <v-col cols="12" md="6">
          <!-- Booking Summary -->
          <v-divider />
          <booking-summary :isStatus="payload.status" />
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
export default {
  name: "ConfirmationForm",
  props: ["queryResult"],
  data: () => ({
    payload: {},
    imgSrc: require("@/assets/GCashScan.png"),
  }),
  components: {
    HeaderBookingSlot,
    TransactionTemplate,
    PaymentTemplate,
    BookingSummary,
  },
  methods: {
    assignPayload: function (payload) {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          this.$set(this.payload, key, payload[key]);
        }
      }
    },
    formatDate(date) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `${formattedDate}`;
    },
  },
  computed: {
    headerData() {
      let status = {};
      let button = {};
      if (this.queryResult.status === "For Reservation") {
        status.type = "Reserved"; // May Change
        status.color = "reserved";
        button.title = "Cancel Reservation";
        button.style = {
          color: "warning",
          outlined: true,
        };
      } else {
        status.type = "Booking"; // May Change
        status.color = "primary";
        button.title = "Save Checked-In Time";
        button.style = {
          color: "primary",
          outlined: false,
        };
      }
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
    showScan() {
      return this.payload?.type === "GCash" ? true : false;
    },
  },
  watch: {
    queryResult: {
      immediate: true,
      handler: function (newVal) {
        this.assignPayload(newVal);
      }
    }
  }
};
</script>

<style scoped></style>
