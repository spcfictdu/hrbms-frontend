<template>
  <div>
    <v-card-title class="text-subtitle-2 font-weight-black px-7"
      >{{ numberOfItems }} {{ item }}
      <v-spacer />

      <!-- Filter Control -->
      <div v-if="show" class="d-flex">
        <div class="d-flex" style="gap: 8px">
          <v-btn
            :ripple="false"
            color="warning"
            @click="clearFn"
            rounded
            class="d-none d-sm-flex"
            outlined
            >Clear</v-btn
          >
          <v-btn
            color="primary"
            rounded
            class="d-none d-sm-flex"
            @click="searchFn"
            ><v-icon left>mdi-magnify</v-icon>Search</v-btn
          >
        </div>
      </div>

      <v-btn
        fab
        outlined
        @click="show = !show"
        :small="$vuetify.breakpoint.smAndUp"
        :x-small="$vuetify.breakpoint.xs"
        color="primary"
        class="ml-2"
      >
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-progress-linear
      class="d-block"
      color="amber"
      :indeterminate="loaderVal"
      :value="100"
    />

    <!-- Search Fields -->
    <v-row v-if="show" class="py-4 px-7">
      <slot />

      <v-col cols="12" class="d-flex justify-end d-sm-none" style="gap: 16px">
        <v-btn :ripple="false" color="warning" rounded outlined @click="clearFn"
          >Clear</v-btn
        >
        <v-btn color="primary" rounded @click="searchFn"
          ><v-icon left>mdi-magnify</v-icon>Search</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TableFilter",
  props: {
    numberOfItems: Number,
    item: String,
    clearFn: Function,
    searchFn: Function,
    loaded: Boolean,
  },
  data: () => ({
    show: false,
    loaderVal: false,
    loaderTimeout: null,
  }),
  watch: {
    loaded: {
      immediate: true,
      handler: function (v) {
        if (v) {
          this.loaderVal = true;

          if (this.loaderTimeout) {
            clearTimeout(this.loaderTimeout);
          }

          this.loaderTimeout = setTimeout(() => {
            this.loaderVal = false;
          }, 3000);
        }
      },
    },
  },
};
</script>

<style scoped></style>
