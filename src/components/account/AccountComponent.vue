<template>
  <div>
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
      :opened="password"
      :onClose="() => setDialogFn({ key: 'password', value: false })"
      :loading="loading.password"
      :alertMeta="alertMeta"
      @onSubmit="(e) => $emit('password-event', e)"
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
  props: { headerData: Object, accommodationData: Array },
  components: { AccountHeader, AccommodationComponent, PasswordDialog },
  data: () => ({}),
  methods: {
    ...mapActions("dialogs", ["setDialogFn"]),
  },
  computed: {
    ...mapState("dialogs", ["password"]),
    ...mapState("account", ["loading"]),
    ...mapState("alerts", ["alertMeta"]),
  },
};
</script>

<style scoped></style>
