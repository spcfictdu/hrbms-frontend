<template>
  <v-app class="bg-color">
    <Navigation />
    <div class="bg-color main-layout mt-n10 white py-5">
      <v-container class="pa-0 transparent-bg">
        <v-main class="mx-3">
          <router-view />
        </v-main>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import Navigation from "./components/navigation/Navigation.vue";

export default {
  name: "App",
  components: { Navigation },
  data: () => ({
    //
  }),
};
</script>

<style scoped>
.main-layout {
  border-radius: 40px 40px 0 0;
}

.bg-color{
  background-color: #F9F6FF !important;
}

.transparent-bg{
  background-color: transparent !important;
}
</style>
