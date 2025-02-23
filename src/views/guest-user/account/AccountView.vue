<template>
  <div class="mt-8" v-if="accountInfo">
    <account-component
      @selected-button="filterData"
      @password-event="requestPasswordUpdate"
      @transaction-event="redirect"
      :alertStatus="accountStatus"
      :headerData="accountHeaderData"
      :accommodationData="accommodationData"
    />
  </div>
</template>

<script>
import AccountComponent from "@/components/account/AccountComponent.vue";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "AccountView",
  components: { AccountComponent },
  data: () => ({
    accommodationData: null,
    confirmationRoute: ["RESERVED"],
    checkInCheckOutRoute: ["CONFIRMED", "CHECKED-IN", "CHECKED-OUT"],
  }),
  methods: {
    ...mapActions("account", ["fetchAccountInfo", "updateAccountPassword"]),
    requestPasswordUpdate: function (payload) {
      this.updateAccountPassword(payload);
    },
    filterData: function (value) {
      switch (value) {
        case "Bookings":
          this.accommodationData = this.accountInfo.bookings;
          break;
        case "Reservations":
          this.accommodationData = this.accountInfo.reservation;
          break;
        case "History":
          this.accommodationData = this.accountInfo.histories;
          break;
        default:
          this.accommodationData = null;
      }
    },
    redirect: function (meta) {
      if (this.confirmationRoute.includes(meta.status)) {
        this.$router.push({
          name: "Guest Confirmation",
          params: {
            referenceNumber: meta.referenceNumber,
          },
        });
      } else if (this.checkInCheckOutRoute.includes(meta.status)) {
        this.$router.push({
          name: "Guest CheckInOut",
          params: {
            referenceNumber: meta.referenceNumber,
          },
        });
      }
    },
  },
  computed: {
    ...mapState("account", {
      accountInfo: "accountInfo",
      accountStatus: "accountStatus",
    }),
    ...mapGetters("account", {
      accountHolder: "accountHolder",
    }),
    accountHeaderData: function () {
      let headerData = {};

      if (this.accountHolder) {
        headerData = {
          fullName: this.accountHolder.fullName,
          phone: this.accountHolder.phone,
          email: this.accountHolder.email,
          city: this.accountHolder.address.city,
          province: this.accountHolder.address.province,
        };
        return headerData;
      }
      return null;
    },
  },
  created() {
    this.fetchAccountInfo();
  },
  watch: {
    accountInfo: {
      immediate: true,
      deep: true,
    }
  }
};
</script>

<style scoped></style>
