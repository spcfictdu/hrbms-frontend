<template>
  <div class="mt-8">
    <edit-details-component
      :accountData="accountHolder"
      :alertMeta="alertMeta"
      :loading="loading.update"
      @update-event="handleUpdate"
      @cancel-event="handleCancel"
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
  created: function () {
    this.fetch();
  },
  methods: {
    ...mapActions("account", [
      "fetchAccountInfo",
      "updateAccountInfo",
      "setLoading",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch: async function () {
      await this.fetchAccountInfo();
    },
    handleUpdate: function (payload) {
      // Prefetch: Only Success Alert and activate loading
      this.requireAlertFn(1);
      this.setLoading({ key: "update", value: true });

      this.updateAccountInfo(payload)
        .then(() => {
          this.$router.push({ name: "Guest Account Details" });
        })
        .finally(() => {
          this.setLoading({ key: "update", value: false });
        });
    },
    handleCancel: function () {
      // Handle Cancel Update
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState("alerts", ["alertMeta"]),
    ...mapState("account", ["loading"]),
    ...mapGetters("account", ["accountHolder"]),
  },
};
</script>

<style scoped></style>
