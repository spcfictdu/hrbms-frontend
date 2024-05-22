<template>
  <div class="mt-10">
    <confirmation-form :queryResult="queryResult" />
  </div>
</template>

<script>
import ConfirmationForm from "../../../components/hotel-rooms/availability/ConfirmationForm.vue"
export default {
  name: "ConfirmationView",
  components: {
    ConfirmationForm,
  },
  methods: {},
  computed: {
    queryResult() {
      let query = this.$route.query.payload;
      let format = JSON.parse(query);
      return format;
    },
  },
};
</script>

<style scoped></style>
