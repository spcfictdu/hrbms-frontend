<template>
  <v-card flat outlined class="card-container">
    <header>
      <div class="text-h6 font-weight-bold text-uppercase">Executive Room</div>
      <p class="text-subtitle-2 font-weight-regular">
        <price-slot><template #price>1000</template></price-slot>
        {{ ` | 2 max occupancy` }}
      </p>
    </header>

    <section>
      <p class="mb-4 text-body-2 font-weight-regular">
        Experience luxury in our Deluxe King Room, featuring a plush king-size
        bed, a stylish seating area, and modern amenities like a flat-screen TV
        and high-speed Wi-Fi. The marble en-suite bathroom offers a rejuvenating
        rain shower and luxurious toiletries, complemented by stunning city
        views through large windows.
      </p>
    </section>

    <v-divider />

    <section class="mt-2">
      <div class="text-overline font-weight-bold">Amenities:</div>
      <div class="grid-container">
        <div
          class="text-muted text-caption font-weight-regular"
          v-for="(i, index) in roomCard.amenites"
          :key="index"
        >
          {{ i }}
        </div>
      </div>
    </section>
  </v-card>
</template>

<script>
import PriceSlot from "@/components/slots/PriceSlot.vue";
export default {
  name: "RoomCard",
  components: { PriceSlot },
  data: () => ({
    roomCard: {
      amenites: [
        "Wi-Fi Access",
        "Coffee/Tea Maker",
        "Flat-Screen Television",
        "Mini-Bar",
        "Room Service",
        "In-Room Safe",
      ],
    },
  }),
};
</script>

<style scoped>
.text-muted {
  color: #555;
}

.card-container {
  padding: 32px 26px;
  border-radius: 10px;
  min-height: 300px;
  height: 100%;
}

.card-container .grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
}
</style>
