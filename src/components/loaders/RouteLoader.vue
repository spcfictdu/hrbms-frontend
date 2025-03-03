<template>
  <div>
    <!-- Fade Transition for Loading -->
    <v-fade-transition mode="out-in" v-if="!showContent">
      <div class="loading-container">
        <div class="d-flex flex-column align-center" style="gap: 16px">
          <v-progress-circular
            :value="progress"
            color="primary"
            size="35"
            rounded
          />
        </div>
      </div>
    </v-fade-transition>

    <!-- Fade Transition for Content -->
    <v-fade-transition mode="out-in" v-if="showContent">
      <slot />
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: "RouteLoader",
  props: {
    target: Boolean,
  },
  data: () => ({
    showContent: false,
    progress: 0,
    interval: null,
  }),
  watch: {
    target: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          this.progress = 0; // Reset progress
          this.showContent = false; // Ensure content is hidden initially

          // Simulate progress completion over time
          this.interval = setInterval(() => {
            if (this.progress < 100) {
              this.progress += 10;
            } else {
              clearInterval(this.interval);
              this.showContent = true;
            }
          }, 150); // Adjust timing of progress increments
        } else {
          this.progress = 0;
          this.showContent = false;
          clearInterval(this.interval);
        }
      },
    },
  },
};
</script>

<style scoped>
.loading-container {
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}
</style>
