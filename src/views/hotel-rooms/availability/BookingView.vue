<template>
  <div class="mt-10">
    <booking-form
      @validation-event="requestPostTransaction"
      :queryResult="queryResult"
      :fillResult="previousTransactions"
    />
  </div>
</template>

<script>
import BookingForm from "../../../components/hotel-rooms/availability/BookingForm.vue";
import HotelRoomsHeader from "@/components/headers/HotelRoomsHeader.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingView",
  data: () => ({}),
  components: {
    BookingForm,
    HotelRoomsHeader,
  },
  methods: {
    ...mapActions("transaction", ["createTransaction", "fetchPreviousFormTransactions"]),
    requestPostTransaction: function (payload) {
      this.createTransaction(this.createObject(payload));
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
    fetchTransactionFills: function () {
      const referenceNumber = this.queryResult.room.details.referenceNumber;
      this.fetchPreviousFormTransactions(referenceNumber);
    }
  },
  computed: {
    ...mapState("transaction", {
      previousTransactions: "previousTransactions"
    }),
    queryResult() {
      let query = this.$route.query.room;
      let format = JSON.parse(query);
      return format;
    },
  },
  mounted() {
    this.fetchTransactionFills();
  }
};
</script>

<style scoped></style>
