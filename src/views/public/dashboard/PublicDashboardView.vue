<template>
  <div class="mt-6">
    <dashboard-component />
  </div>
</template>

<script>
import DashboardComponent from '@/components/public/dashboard/DashboardComponent.vue'
export default {
  name: "PublicDashboardView.vue",
  components: { DashboardComponent },
  data: () => ({

  }),
}
</script>

<style scoped>

</style>