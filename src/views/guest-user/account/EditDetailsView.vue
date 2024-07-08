<template>
  <div class="mt-8">
    <edit-details-component
      :accountData="accountHolder"
      :alertStatus="accountStatus"
      @update-event="requestAccountUpdate"
      @cancel-event="requestCancelEvent"
    />
  </div>
</template>

<script>
import EditDetailsComponent from "@/components/account/EditDetailsComponent.vue";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "EditDetailsView",
  components: { EditDetailsComponent },
  data: () => ({}),
  methods: {
    ...mapActions("account", ["fetchAccountInfo", "updateAccountInfo"]),
    requestAccountUpdate: function (payload) {
      this.updateAccountInfo(payload);
    },
    requestCancelEvent: function () {
      this.$router.push({ name: "Guest Account Details" });
    },
  },
  computed: {
    ...mapState("account", {
      accountStatus: "accountStatus",
    }),
    ...mapGetters("account", {
      accountHolder: "accountHolder",
    }),
  },
  created() {
    this.fetchAccountInfo();
  },
};
</script>

<style scoped></style>
