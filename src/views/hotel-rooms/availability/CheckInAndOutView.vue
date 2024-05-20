<template>
  <div class="mt-10">
    <confirmed-details :queryResult="queryResult"/>
  </div>
</template>

<script>
import ConfirmedDetails from "@/components/hotel-rooms/availability/ConfirmedDetails.vue";
export default {
  name: "CheckInAndOut",
  components: {
    ConfirmedDetails,
  },
  computed: {
    queryResult() {
        let query = this.$route.query.payload;
        let format = JSON.parse(query);
        return format;
    }
  }
};
</script>

<style scoped></style>
