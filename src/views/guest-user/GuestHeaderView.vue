<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PublicHeader />
    <router-view />
  </div>
</template>

<script>
import PublicHeader from "@/components/headers/PublicHeader.vue";
export default {
  name: "PublicHeaderView",
  components: { PublicHeader },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
