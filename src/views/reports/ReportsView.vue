<template>
  <div
    :class="{
      'xl-padding': $vuetify.breakpoint.xl,
      'px-sm-2 py-md-8': $vuetify.breakpoint.lgAndDown,
    }"
  >
    <PageHeader class="mb-9" />
    <div>
      <v-btn
        @click="redirect(button.route)"
        :class="[
          button.route === $route.name
            ? 'font-weight-bold'
            : 'font-weight-regular',
        ]"
        text
        v-for="button in buttons"
        :key="button.text"
      >
        {{ button.text }}
      </v-btn>
    </div>
    <v-divider />
    <RouterView />
    <!-- <RouteLoader :target="true" class="mt-10"></RouteLoader> -->
  </div>
</template>

<script>
import RouteLoader from "@/components/loaders/RouteLoader.vue";
import PageHeader from "@/components/headers/PageHeader.vue";

export default {
  name: "ReportsView",
  components: { PageHeader, RouteLoader },
  data() {
    return {
      buttons: [
        { text: "Guests", route: "GuestReports" },
        { text: "Flights", route: "FlightReports" },
        { text: "Cashiers", route: "CashierReports" },
      ],
    };
  },
  computed: {
    hasData() {},
  },
  methods: {
    redirect(route) {
      if (this.$route.name === route) return;
      this.$router.replace({ name: route });
    },
  },
};
</script>

<style scoped>
.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
