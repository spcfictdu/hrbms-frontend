<template>
  <div
    :class="{
      'xl-padding mt-n3': $vuetify.breakpoint.xl,
      'px-sm-2 mx-md-n3 my-md-5 mx-sm-n3 my-sm-n3': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <GuestListTable />
  </div>
</template>

<script>
import GuestListTable from "@/components/guests/GuestListTable.vue";
export default {
  name: "GuestListView",
  components: { GuestListTable },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 288px 0 288px;
}
</style>
