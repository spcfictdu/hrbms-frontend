<template>
  <div class="mt-10">
    <RouteLoader :target="hasData">
      <confirmed-details @update-event="handleUpdate" :value="transaction" />
    </RouteLoader>
  </div>
</template>

<script>
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import ConfirmedDetails from "../../../components/hotel-rooms/forms/ConfirmedDetails.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "CheckInAndOut",
  components: {
    ConfirmedDetails,
    RouteLoader,
  },
  props: {
    referenceNumber: String,
  },
  created() {
    this.fetch();
  },
  methods: {
    ...mapActions("transaction", [
      "fetchTransaction",
      "updateTransaction",
      "setLoading",
    ]),
    ...mapActions("alerts", ["requireAlertFn"]),
    fetch: async function () {
      this.fetchTransaction(this.referenceNumber);
    },
    handleUpdate: function (payload) {
      // Prefetch the alert function: success, error
      this.requireAlertFn(2);
      this.setLoading({ key: "header", value: true });

      this.updateTransaction(payload)
        .then(() => {
          this.fetchTransaction(payload.referenceNumber);
        })
        .catch((err) => {})
        .finally(() => {
          this.setLoading({ key: "header", value: false });
        });
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
    hasData: function () {
      return !!this.transaction ?? false;
    },
  },
};
</script>

<style scoped></style>
