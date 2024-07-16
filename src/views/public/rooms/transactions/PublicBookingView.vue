<template>
  <div class="mt-10">
    <booking-form
      @validation-event="requestValidation"
      :queryResult="queryResult"
      :guestAutofill="guestAutofill"
    />
  </div>
</template>

<script>
import BookingForm from "@/components/hotel-rooms/forms/BookingForm.vue";
import { mapActions } from "vuex";
export default {
  name: "PublicBookingView",
  components: { BookingForm },
  data: () => ({}),
  methods: {
    ...mapActions("publicRooms", ["storeTemporaryData"]),
    ...mapActions("transaction", ["createTransaction", "triggerLoading"]),
    requestValidation: function (payload) {
      if (payload.action === "REGISTER") {
        // Add Query and Data
        let temporaryData = this.createObject(payload.payload);
        temporaryData.query = this.$route.query;

        this.storeTemporaryData(temporaryData).then(() => {
          this.$router.replace({ name: "Guest Sign In" });
        });
      } else {
        this.triggerLoading({
          title: "Create Transaction",
          loading: true,
        }).then(() => {
          this.createTransaction(this.createObject(payload.payload)).then(
            () => {
              this.$router.replace({ name: "Public Dashboard" });
            }
          );
        });
      }
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
    guestAutofill: function () {
      let fill = {};
      if (!this.$auth.user()) {
        fill = {
          checkInTime: "14:00",
          checkOutTime: "11:00",
        };
      }
      return fill;
    },
  },
};
</script>

<style scoped></style>
