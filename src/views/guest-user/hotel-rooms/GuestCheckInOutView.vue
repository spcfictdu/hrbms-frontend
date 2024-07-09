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
import ConfirmedDetails from "@/components/hotel-rooms/forms/ConfirmedDetails.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "GuestCheckInOutView",
  components: { ConfirmedDetails },
  methods: {
    ...mapActions("transaction", ["fetchTransaction", "updateTransaction"]),
    fetchData: function () {
      const referenceNumber = this.$route.params.referenceNumber;
      this.fetchTransaction(referenceNumber);
    },
    requestUpdate: function (payload) {
      this.updateTransaction(payload).then((response) => {
        if (payload.status === "RESERVED") {
          this.$router.push({
            name: "Guest CheckInOut",
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
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
