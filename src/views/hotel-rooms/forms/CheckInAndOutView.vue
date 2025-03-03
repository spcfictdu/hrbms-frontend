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
    ...mapActions("transaction", ["fetchTransaction", "updateTransaction"]),
    fetch: async function () {
      this.fetchTransaction(this.referenceNumber);
    },
    handleUpdate: function (payload) {
      this.updateTransaction(payload).then(() => {
        if (payload.status === "RESERVED") {
          this.$router.push({
            name: "CheckInOut",
            params: { referenceNumber: payload.referenceNumber },
          });
        } else {
          this.fetchTransaction(payload.referenceNumber);
        }
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
