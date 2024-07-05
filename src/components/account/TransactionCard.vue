<template>
  <div>
    <v-card flat outlined class="card-container">
      <div>
        <div class="text-body-1 text-sm-h6 text-uppercase font-weight-bold">
          Executive Room
        </div>
        <div class="d-flex align-center flex-wrap">
          <v-chip
            color="primary"
            x-small
            class="chip-breakpoint font-weight-medium"
            >JAN 01, 2025 - JAN 03, 2025</v-chip
          >
          <div
            class="mobile-breakpoint text-caption primary--text font-weight-bold"
          >
            JAN 01, 2025 - JAN 03, 2025
          </div>
          <div class="text-caption text-sm-subtitle-2 price-margin">
            <span class="font-weight-bold"
              >PHP 1000<small class="font-weight-regular"
                >/TOTAL PAYMENT</small
              ></span
            >
          </div>
        </div>
      </div>

      <p class="mt-4 text-body-2">
        Experience luxury in our Executive Room, featuring a plush king-size
        bed, a stylish seating area, and modern amenities like a flat-screen TV
        and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating
        rain shower and luxurious toiletries, complemented by stunning city
        views through large windows.
      </p>

      <v-divider />

      <section class="mt-4">
        <div class="text-overline font-weight-bold">Amenities:</div>
        <div class="grid-container">
          <div
            class="text-muted text-caption font-weight-regular"
            v-for="(i, index) in amenities"
            :key="index"
          >
            {{ i }}
          </div>
        </div>
      </section>
    </v-card>
    <!-- <v-card v-else flat outlined class="card-container transparent-bg d-flex justify-center align-center">
      <div>
        You don’t have any reservations.
      </div>
    </v-card> -->
  </div>
</template>

<script>
export default {
  name: "TransactionCard",
  data: () => ({
    amenities: [
      "Wi-Fi Access",
      "Coffee/Tea Maker",
      "Flat-Screen Television",
      "In-Room Safe",
    ],
    sample: [],
  }),
  methods: {},
  computed: {},
};
</script>

<style scoped>
.transparent-bg {
  background: transparent;
}

.text-muted {
  color: #555555;
}

.card-container {
  padding: 16px 20px;
  border-radius: 10px;
  min-height: 150px;
}

.chip-breakpoint {
  display: flex;
}

.mobile-breakpoint {
  display: none;
}

.price-margin {
  margin-left: 4px;
}

@media (max-width: 360px) {
  .chip-breakpoint {
    display: none;
  }
  .mobile-breakpoint {
    display: flex;
  }
  .price-margin {
    margin-left: 0;
  }
}

.card-container .grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
}

@media (max-width: 599px) {
  .card-container .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
