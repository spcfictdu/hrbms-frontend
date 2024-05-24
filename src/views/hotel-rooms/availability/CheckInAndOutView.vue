<template>
  <div class="mt-10">
    <confirmed-details
      @update-event="requestUpdate"
      :result="transaction"
      v-if="transaction"
    />
  </div>
</template>

<script>
import ConfirmedDetails from "../../../components/hotel-rooms/availability/ConfirmedDetails.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "CheckInAndOut",
  components: {
    ConfirmedDetails,
  },
  methods: {
    ...mapActions("transaction", ["fetchTransaction", "updateTransaction"]),
    fetchData: function () {
      const referenceNumber = this.$route.params.referenceNumber;
      this.fetchTransaction(referenceNumber);
    },
    requestUpdate: function (payload) {
      this.updateTransaction(payload);
    },
  },
  computed: {
    ...mapState("transaction", ["transaction"]),
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
