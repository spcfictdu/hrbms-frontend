<template>
  <v-row class="gap-size">
    <v-col>
      <title-section />
    </v-col>
    <v-col>
      <card-section-one />
    </v-col>
  </v-row>
</template>

<script>
import CardSectionOne from './CardSectionOne.vue';
import TitleSection from "./TitleSection.vue";
export default {
  name: "DashboardContent",
  components: { TitleSection, CardSectionOne },
  data: () => ({}),
};
</script>

<style scoped>
.gap-size {
  row-gap: 10px;
}
</style>
