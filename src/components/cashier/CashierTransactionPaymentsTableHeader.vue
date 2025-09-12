<template>
  <div>
    <div class="d-flex px-2">
      <div v-for="header in headerDetails" :key="header.name">
        <v-card-text>
          <div class="grey--text font-weight-bold">{{ header.headerText }}</div>
          <div
            class="text-subtitle-1 font-weight-bold"
            :class="header.value.styles"
          >
            {{ header.value.text }}
          </div>
        </v-card-text>
      </div>
    </div>

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
  name: "CashierTransactionPaymentsTableHeader",
  props: {
    headerDetails: Array,
  },
  data: () => ({
    loaderVal: false,
    loaderTimeout: null,
  }),
  computed: {
    mappedDetails() {
      return [
        {
          name: "Total Payment",
          value: "Test",
          styles: "light-green--text text--accent-4",
        },
        {
          name: "Total Balance",
          value: "299",
          styles: "red--text text--accent-4",
        },
      ];
    },
  },
  watch: {
    "headerDetails.length": {
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
