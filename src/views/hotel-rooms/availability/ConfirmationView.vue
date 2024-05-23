<template>
  <div class="mt-10">
    <confirmation-form :result="transaction" v-if="transaction"/>
  </div>
</template>

<script>
import ConfirmationForm from "../../../components/hotel-rooms/availability/ConfirmationForm.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "ConfirmationView",
  components: {
    ConfirmationForm,
  },
  methods: {
    ...mapActions("transaction", ["fetchTransaction"]),
    fetchData: function () {
      const referenceNumber = this.$route.params.referenceNumber;
      this.fetchTransaction(referenceNumber);
    }
  },
  computed: {
    ...mapState("transaction", ["transaction"])
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped></style>
