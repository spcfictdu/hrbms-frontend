<template>
  <div class="mt-10">
    <booking-form
      :query="query"
      :fills="returnPreviousTransactions"
      :guestAutofill="guestAutofill"
      @onSubmit="handleCreateTransaction"
    />
  </div>
</template>

<script>
import BookingForm from "../../../components/hotel-rooms/forms/BookingForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingView",
  components: {
    BookingForm,
  },
  data: () => ({
    userId: null,
    routes: {
      GUEST: {
        RESERVED: "Guest Confirmation",
      },
      ADMIN: {
        RESERVED: "Confirmation",
        CONFIRMED: "CheckInOut",
        CHECKED_OUT: "CheckInOut",
      },
    },
  }),
  created: async function () {
    await this.fetch();

    if (!this.user || this.userRole !== "ADMIN") return;
    const userFullName = `${this.$auth.user().firstName} ${
      this.$auth.user().lastName
    }`;
    this.userId = this.sessions.find(
      (s) => s.userFullName === userFullName
    ).userId;
  },
  methods: {
    ...mapActions("transaction", [
      "createTransaction",
      "fetchPreviousFormTransactions",
      "setLoading",
    ]),
    ...mapActions("publicRooms", ["storeTemporaryData", "clearTempData"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    ...mapActions("cashier", ["fetchSessions"]),
    handleCreateTransaction: function (payload) {
      // Prefetch required alerts
      this.requireAlertFn(2);
      this.setLoading({ key: "dialog", value: true });

      // Check if whether a user has an account, then return the right parameters.
      let formattedPayload =
        ["REGISTER", "MAYBE"].includes(payload?.action) && !this.user
          ? this.assignObject(payload.payload)
          : this.assignObject(payload);

      if (payload.status === "CONFIRMED") {
        sessionStorage.setItem(
          "payload",
          JSON.stringify({
            ...formattedPayload,
            roomNumber: payload.roomNumber,
          })
        );
        this.$router.push({
          name: "Cashier",
          params: { id: String(this.userId) },
        });
        this.setLoading({ key: "dialog", value: false });
        return;
      }

      // Check if a user will register or proceed without registering.
      // Storing temporary data for rebooking after registration.
      if (!this.user && payload?.action === "REGISTER") {
        formattedPayload.query = this.$route.query;
        return this.storeTemporaryData(formattedPayload)
          .then(() =>
            this.$router.replace({
              name: "Guest Sign In",
              query: {
                method: "register",
              },
            })
          )
          .finally(() => this.setLoading({ key: "dialog", value: false }));
      }

      // Create transaction
      this.createTransaction(formattedPayload)
        .then((response) => {
          const { status, referenceNumber } = response.data.results;
          const route = this.user
            ? this.routes[this.userRole][status]
            : "Public Dashboard";

          if (this.userRole === "GUEST") this.clearTempData();

          // If user is not logged in, redirect to public dashboard
          this.$router[this.user ? "push" : "replace"]({
            name: route,
            ...(this.user && { params: { referenceNumber } }),
          });
        })
        .catch((err) => {})
        .finally(() => {
          this.setLoading({ key: "dialog", value: false });
        });
      sessionStorage.removeItem("formDetails");
    },
    assignObject: function (payload) {
      // RESERVED INITIAL VALUE
      let value = {
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
        roomTotal: payload.roomTotal,
      };

      if (payload.status === "CONFIRMED") {
        value.payment = payload.payment;
      }

      if (payload.accountId) {
        value.guest.accountId = payload.accountId;
      }

      if (payload.discount) {
        value.discount = payload.discount;

        if (payload.discount === "VOUCHER") {
          value.voucherCode = payload.voucherCode;
        } else {
          value.idNumber = payload.idNumber;
        }
      }

      if (payload.addons) {
        value.addons = payload.addons.map(({ name, quantity }) => ({
          name,
          quantity: String(quantity),
        }));
      }
      return value;
    },
    fetch: async function () {
      const referenceNumber = this.query.referenceNumber;

      if (this.userRole === "ADMIN" || this.userRole === "FRONT DESK") {
        this.fetchPreviousFormTransactions(referenceNumber);
        await this.fetchSessions();
      }
    },
  },
  computed: {
    ...mapState("transaction", ["previousTransactions"]),
    ...mapState("account", ["userInfo"]),
    ...mapState("publicRooms", ["temporaryData"]),
    ...mapState("cashier", ["sessions"]),
    returnPreviousTransactions() {
      return this.previousTransactions ? this.previousTransactions : {};
    },
    query: function () {
      return this.$route.query;
    },
    user: function () {
      return this.$auth.user();
    },
    userRole: function () {
      return this.$auth.user()?.role;
    },
    guestAutofill: function () {
      let fill = {};

      if (!this.user) {
        fill = {
          checkInTime: "14:00",
          checkOutTime: "11:00",
        };
      }

      if (this.userRole === "GUEST") {
        if (this.temporaryData) {
          fill = {
            status: this.temporaryData.status,
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
            addons: this.temporaryData.addons,
            id: {
              type: this.temporaryData.guest.id.type,
              number: this.temporaryData.guest.id.number,
            },
          };
        } else {
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
        }
      }
      return fill;
    },
  },
};
</script>

<style scoped></style>
