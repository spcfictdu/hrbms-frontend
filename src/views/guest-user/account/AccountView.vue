<template>
  <div class="mt-8" v-if="accountInfo">
    <account-header :headerData="accountHeaderData"/>

    <v-divider/>

    <accommodation-component :accommodationData="accommodationData" @selected-button="filterData"/>

    <!--  Change Password Dialog  -->
    <password-dialog/>
  </div>
</template>

<script>
import AccountHeader from '@/components/account/AccountHeader.vue';
import AccommodationComponent from '@/components/account/AccomodationComponent.vue';
import PasswordDialog from "@/components/dialogs/PasswordDialog.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "AccountView",
  components: { AccountHeader, AccommodationComponent, PasswordDialog },
  data: () => ({
    accommodationData: null
  }),
  methods: {
    ...mapActions("account", ["fetchAccountInfo"]),
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
    }
  },
  computed: {
    ...mapState("account", {
      accountInfo: "accountInfo",
    }),
    accountHeaderData: function () {
      const data = this.accountInfo?.accountInfo;
      let headerData = {};

      if (this.accountInfo) {
        headerData = {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          city: data.address.city,
          province: data.address.province,
        };
        return headerData;
      }
      return null;
    }
  },
  created() {
    this.fetchAccountInfo();
  }
}
</script>

<style scoped>

</style>