<template>
  <div>
    <v-row>
      <v-col v-for="(value, name) in mappedDetails" :key="name">
        <v-card-text class="px-7">
          <div class="grey--text font-weight-bold">{{ name }}</div>
          <div class="text-subtitle-1 font-weight-bold">{{ value }}</div>
        </v-card-text>
      </v-col>
    </v-row>

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
  name: "CashierTransactionDetailsTableHeader",
  props: {
    headerDetails: Object,
  },
  data: () => ({
    loaderVal: false,
    loaderTimeout: null,
  }),
  computed: {
    mappedDetails() {
      return {
        "Guest Name": this.headerDetails.guestName,
        "Reference Number": this.headerDetails.referenceNumber,
        "Total Payment": this.headerDetails.totalPayment,
        Date: this.headerDetails.date,
      };
    },
  },
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
