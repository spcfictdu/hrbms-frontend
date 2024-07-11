<template>
  <div>
    <!-- Alert -->
    <v-alert
      :value="isShowAlert"
      :type="handleAlertType"
      class="w-full"
      transition="scroll-y-transition"
    >
      {{ alertStatus.message ?? alertStatus.message }}
    </v-alert>

    <!-- Header -->
    <account-header :headerData="headerData" />

    <v-divider />

    <!-- Main -->
    <accommodation-component
      :accommodationData="accommodationData"
      @selected-button="(e) => $emit('selected-button', e)"
      @transaction-event="(e) => $emit('transaction-event', e)"
    />

    <!--  Password Dialog  -->
    <password-dialog
      :passwordDialog="passwordDialog"
      :alertStatus="alertStatus"
      @cancel-event="resetPasswordDialog(false)"
      @reset-dialog="resetPasswordDialog"
      @password-event="(e) => $emit('password-event', e)"
    />
  </div>
</template>

<script>
import AccountHeader from "@/components/account/AccountHeader.vue";
import AccommodationComponent from "@/components/account/AccomodationComponent.vue";
import PasswordDialog from "@/components/dialogs/PasswordDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "AccountComponent",
  props: { headerData: Object, accommodationData: Array, alertStatus: Object },
  components: { AccountHeader, AccommodationComponent, PasswordDialog },
  data: () => ({
    isShowAlert: false,
  }),
  methods: {
    ...mapActions("account", ["triggerPasswordDialog"]),
    triggerAlert: function (value) {
      this.isShowAlert = value;
    },
    resetPasswordDialog: function (dialog) {
      if (!dialog) {
        this.triggerPasswordDialog(false);
      }
    },
  },
  computed: {
    ...mapState("account", {
      passwordDialog: "passwordDialog",
    }),
    handleAlertType() {
      return this.alertStatus.status !== ""
        ? this.alertStatus.status.toLowerCase()
        : "success";
    },
  },
  watch: {
    alertStatus: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        if (newVal.status.toLowerCase() === "success") {
          this.triggerAlert(true);
          let interval = setInterval(() => {
            this.triggerAlert(false);
            clearInterval(interval);
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
