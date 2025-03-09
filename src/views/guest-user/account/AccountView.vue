<template>
  <div class="mt-8" v-if="accountInfo">
    <account-component
      @selected-button="filterData"
      @password-event="requestPasswordUpdate"
      @transaction-event="redirect"
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
  created: function () {
    this.fetch();
  },
  methods: {
    ...mapActions("account", [
      "fetchAccountInfo",
      "updateAccountPassword",
      "setLoading",
    ]),
    ...mapActions("dialogs", ["setDialogFn"]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch: async function () {
      await this.fetchAccountInfo();
    },
    requestPasswordUpdate: function (payload) {
      // Prefetch
      this.requireAlertFn(1);
      this.setLoading({ key: "password", value: true });

      this.updateAccountPassword(payload)
        .then(() => {
          this.setDialogFn({ key: "password", value: false });
        })
        .finally(() => {
          this.setLoading({ key: "password", value: false });
        });
    },
    filterData: function (value) {
      const data = {
        Bookings: this.accountInfo.bookings,
        Reservations: this.accountInfo.reservation,
        History: this.accountInfo.histories,
      };
      this.accommodationData = data[value];
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
    ...mapState("account", ["accountInfo"]),
    ...mapGetters("account", ["accountHolder"]),
    accountHeaderData: function () {
      if (!this.accountHolder) return;

      return {
        fullName: this.accountHolder.fullName,
        phone: this.accountHolder.phone,
        email: this.accountHolder.email,
        city: this.accountHolder.address.city,
        province: this.accountHolder.address.province,
      };
    },
  },
};
</script>

<style scoped></style>
