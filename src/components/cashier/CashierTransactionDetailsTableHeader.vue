<template>
  <div>
    <div class="d-flex flex-wrap flex-lg-nowrap px-2 printable-flex-header">
      <div
        v-for="(value, name, index) in tableHead"
        :key="name"
        :class="{ 'flex-shrink-0': index !== 0 }"
      >
        <v-card-text>
          <div class="grey--text font-weight-bold">{{ name }}</div>
          <div class="text-subtitle-1 font-weight-bold">{{ value }}</div>
        </v-card-text>
      </div>
    </div>

    <v-progress-linear
      class="d-block no-print"
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
    tableHead: Object,
  },
  data: () => ({
    loaderVal: false,
    loaderTimeout: null,
  }),
  computed: {
    mappedDetails() {
      const details = {
        "Guest Name": this.headerDetails?.guestName,
        "Reference Number": this.headerDetails?.referenceNumber,
        Date: this.headerDetails?.date,
      };
      if (this.headerDetails.totalPurchase)
        details["Total Purchase"] = this.headerDetails.totalPurchase.toFixed(2);

      return details;
    },
  },
  watch: {
    "headerDetails.referenceNumber": {
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
