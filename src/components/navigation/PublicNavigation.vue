<template>
  <div class="bgImage pb-10 pt-md-5 pb-md-15">
    <v-container
      class="py-md-0"
      :class="{ 'xl-padding': $vuetify.breakpoint.xl }"
    >
      <v-row no-gutters>
        <v-col>
          <div
            class="ml-4 ml-md-0 d-flex flex-row flex-sm-column justify-sm-center align-center"
          >
            <v-avatar size="40">
              <img :src="institution.logo" alt="FCPC Logo" />
            </v-avatar>
            <div class="ml-4 ml-sm-0 mt-sm-2 d-flex flex-column white--text">
              <p
                class="text-caption text-sm-body-2 order-last order-sm-first pa-0 ma-0"
              >
                {{ institution.name }}
              </p>
              <p
                class="d-flex d-sm-none text-subtitle-2 font-weight-bold order-first pa-0 ma-0"
              >
                {{ institution.acronym }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "PublicNavigation",
  data: () => ({
    institution: {
      name: "Systems Plus College Foundation",
      acronym: "SPCF",
      logo: require("@/assets/logos/SPCFLogo.png"),
    },
  }),
};
</script>

<style scoped>
.bgImage {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url(../../assets/bgImage-3.png) no-repeat 50% / cover;
}

.xl-padding {
  padding: 0 300px 0 300px;
}
</style>
