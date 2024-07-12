<template>
  <div class="mt-10">
    <booking-form
      @validation-event="requestPostTransaction"
      :queryResult="queryResult"
      :guestAutofill="guestAutofill"
    />
  </div>
</template>

<script>
import BookingForm from "@/components/hotel-rooms/forms/BookingForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestBookingView",
  components: { BookingForm },
  data: () => ({}),
  methods: {
    ...mapActions("transaction", [
      "createTransaction",
      "fetchPreviousFormTransactions",
      "triggerLoading",
    ]),
    ...mapActions("publicRooms", ["clearTempData"]),
    requestPostTransaction: function (payload) {
      this.triggerLoading({
        title: "Create Transaction",
        loading: true,
      }).then(() => {
        this.createTransaction(this.createObject(payload)).then((response) => {
          // Clear Temp Data
          this.clearTempData();

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
    ...mapState("account", {
      userInfo: "userInfo",
    }),
    ...mapState("publicRooms", {
      temporaryData: "temporaryData",
    }),
    queryResult() {
      return this.$route.query;
    },
    guestAutofill: function () {
      let fill = {};
      if (this.$auth.user()?.role === "GUEST" || !this.$auth.user()) {
        if (this.temporaryData) {
          fill = {
            first_name: this.temporaryData.guest.firstName,
            middle_name: this.temporaryData.guest.middleName,
            last_name: this.temporaryData.guest.lastName,
            phone_number: this.temporaryData.guest.contact.phoneNum,
            email: this.temporaryData.guest.contact.email,
            city: this.temporaryData.guest.address.city,
            province: this.temporaryData.guest.address.province,
            checkInTime: this.temporaryData.checkIn.time,
            checkOutTime: this.temporaryData.checkOut.time,
            checkInDate: this.temporaryData.checkIn.date,
            checkOutDate: this.temporaryData.checkOut.date,
            extraPerson: this.temporaryData.guest.extraPerson,
            id: {
              type: this.temporaryData.guest.id.type,
              number: this.temporaryData.guest.id.number,
            },

            status: this.temporaryData.status,
          };
          if (this.temporaryData.payment) {
            fill.payment = this.temporaryData.payment;
          }
        } else {
          if (this.$auth.user()?.role === "GUEST") {
            fill = {
              first_name: this.userInfo.firstName,
              middle_name: this.userInfo.middleName,
              last_name: this.userInfo.lastName,
              phone_number: this.userInfo.phone,
              email: this.userInfo.email,
              city: this.userInfo.address.city,
              province: this.userInfo.address.province,
              checkInTime: "14:00",
              checkOutTime: "11:00",
            };
          } else {
            fill = {
              checkInTime: "14:00",
              checkOutTime: "11:00",
            };
          }
        }
      }
      return fill;
    },
  },
};
</script>

<style scoped></style>
