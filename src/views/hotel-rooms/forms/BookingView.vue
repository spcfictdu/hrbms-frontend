<template>
  <div class="mt-10">
    <booking-form
      @validation-event="requestPostTransaction"
      :queryResult="queryResult"
      :fillResult="returnPreviousTransactions"
      :metaLoading="meta"
    />
  </div>
</template>

<script>
import BookingForm from "../../../components/hotel-rooms/forms/BookingForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "BookingView",
  data: () => ({}),
  components: {
    BookingForm,
  },
  methods: {
    ...mapActions("transaction", [
      "createTransaction",
      "fetchPreviousFormTransactions",
      "triggerLoading",
    ]),
    requestPostTransaction: function (payload) {
      this.triggerLoading({
        title: "Create Transaction",
        loading: true,
      }).then(() => {
        this.createTransaction(this.createObject(payload)).then((response) => {
          if (response) {
            if (response.data.results.status === "RESERVED") {
              this.$router.push({
                name: "Confirmation",
                params: {
                  referenceNumber: response.data.results.referenceNumber,
                },
              });
            } else {
              this.$router.push({
                name: "CheckInOut",
                params: {
                  referenceNumber: response.data.results.referenceNumber,
                },
              });
            }
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

      if (payload.accountId) {
        value.guest.accountId = payload.accountId;
      }

      return value;
    },
    fetchTransactionFills: function () {
      const referenceNumber = this.queryResult.referenceNumber;
      this.fetchPreviousFormTransactions(referenceNumber);
    },
  },
  computed: {
    ...mapState("transaction", {
      previousTransactions: "previousTransactions",
      meta: 'meta',
    }),
    returnPreviousTransactions() {
      return this.previousTransactions ? this.previousTransactions : [];
    },
    queryResult() {
      return this.$route.query;
    },
  },
  mounted() {
    this.fetchTransactionFills();
  },
};
</script>

<style scoped></style>
