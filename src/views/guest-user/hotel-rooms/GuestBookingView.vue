<template>
  <div class="mt-10">
    <booking-form
      @validation-event="requestPostTransaction"
      :queryResult="queryResult"
    />
  </div>
</template>

<script>
import BookingForm from "@/components/hotel-rooms/forms/BookingForm.vue";
import { mapActions } from "vuex";
export default {
  name: "GuestBookingView",
  components: { BookingForm },
  data: () => ({}),
  methods: {
    ...mapActions("transaction", [
      "createTransaction",
      "fetchPreviousFormTransactions",
    ]),
    requestPostTransaction: function (payload) {
      this.createTransaction(this.createObject(payload)).then((response) => {
        if (response.data.results.status === "RESERVED") {
            this.$router.push({
              name: "Guest Confirmation",
              params: {
                referenceNumber: response.data.results.referenceNumber,
              },
            });
          } else {
            this.$router.push({
              name: "Guest CheckInOut",
              params: {
                referenceNumber: response.data.results.referenceNumber,
              },
            });
          }
      });
    },
    createObject: function (payload) {
      let value = {};

      if (payload.status === "RESERVED") {
        value = {
          status: payload.status,
          guest: {
            firstName: payload.firstName,
            middleName: payload.middleName,
            lastName: payload.lastName,
            address: payload.address,
            contact: {
              email: payload.contact.email,
              phoneNum: payload.contact.phoneNumber,
            },
            id: payload.id,
            extraPerson: payload.guests,
          },
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          room: payload.room,
        };
      } else {
        value = {
          status: payload.status,
          guest: {
            firstName: payload.firstName,
            middleName: payload.middleName,
            lastName: payload.lastName,
            address: payload.address,
            contact: {
              email: payload.contact.email,
              phoneNum: payload.contact.phoneNumber,
            },
            id: payload.id,
            extraPerson: payload.guests,
          },
          payment: payload.payment,
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          room: payload.room,
        };
      }

      return value;
    },
  },
  computed: {
    queryResult() {
      return this.$route.query;
    },
  },
};
</script>

<style scoped></style>
