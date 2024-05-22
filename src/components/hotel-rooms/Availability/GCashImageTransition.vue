<template>
  <v-expand-transition>
    <div v-show="showScan" class="lightBg rounded-lg pa-6 text-center">
      <v-img eager class="mx-auto" :src="imgSrc" max-width="200"></v-img>
    </div>
  </v-expand-transition>
</template>

<script>
export default {
  name: "GcashImageTransition",
  props: ["showScan"],
  data: () => ({
    imgSrc: require("@/assets/GCashScan.png"),
  }),
};
</script>

<style scoped></style>
