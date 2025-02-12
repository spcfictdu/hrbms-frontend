<template>
  <div>
    <!-- Fade Transition for Loading -->
    <v-fade-transition mode="out-in">
      <div v-if="!target" class="loading-container">
        <div class="d-flex flex-column align-center" style="gap: 16px">
          <v-img :src="logo" contain width="150" eager />
          <v-progress-circular size="35" indeterminate color="primary" />
        </div>
      </div>
    </v-fade-transition>

    <!-- Fade Transition for Content -->
    <v-fade-transition mode="out-in">
      <slot v-if="target" />
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: "PageLoader",
  props: {
    target: Boolean,
  },
  data: () => ({
    logo: require("@/assets/SPCFLogo.png"),
  }),
};
</script>

<style scoped>
.loading-container {
  background: #fff;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
