<template>
  <div>
    <header-booking-slot @button-event="headerEvents" :headerData="headerData">
    </header-booking-slot>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <!-- Transaction -->
          <v-divider />
          <transaction-template :statuses="statuses" @emit-transaction="assignPayload" />

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
export default {
  name: "ConfirmationForm",
  props: ["queryResult"],
  data: () => ({
    payload: {},
    imgSrc: require("@/assets/GCashScan.png"),
    statuses: ["For Reservation & Confirmation"],
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
    submitForValidation: function () {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        // API request
        this.$router.push({
          name: "CheckInOut",
          query: {
            payload: JSON.stringify(this.payload),
          },
        });
      }
    },
    headerEvents: function () {
      // Cancel Reservation
    },
  },
  computed: {
    headerData() {
      let status = {};
      let button = {};
      if (this.queryResult.status === "For Reservation") {
        status.type = "Reserved"; // May Change
        button.title = "Cancel Reservation";
        button.style = {
          color: "warning",
          outlined: true,
        };
      } 
      return {
        client: `${this.queryResult.lastName}, ${this.queryResult.firstName} ${
          this.queryResult.middleName ? this.queryResult.middleName : ""
        }`,
        from: {
          date: this.queryResult.checkIn.date,
        },
        to: {
          date: this.queryResult.checkOut.date,
        },
        status: status,
        button: button,
      };
    },
    showScan() {
      return this.payload.payment?.type === "GCash" ? true : false;
    },
    cardInformation() {
      return {
        type: this.payload.room.type,
        roomName: this.payload.room.roomName,
        client: `${this.payload.lastName}, ${this.payload.firstName} ${
          this.payload.middleName ? this.payload.middleName : ""
        }`,
        button: {
          title: "Record Payment",
          outlined: false,
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
    payload: {
      immediate: true,
      handler: function (newVal) {
        console.log(newVal);
      },
    },
  },
};
</script>

<style scoped></style>
