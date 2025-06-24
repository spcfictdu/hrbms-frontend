<template>
  <div>
    <v-card-title class="text-subtitle-2 font-weight-black px-7"
      >{{ numberOfItems }} ITEMS
    </v-card-title>

    <v-progress-linear
      class="d-block"
      color="amber"
      :indeterminate="loaderVal"
      :value="100"
    />
  </div>
</template>

<script>
export default {
  name: "CashierHistoryTableHeader",
  props: {
    numberOfItems: Number,
    loaded: Boolean,
  },
  data: () => ({
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
