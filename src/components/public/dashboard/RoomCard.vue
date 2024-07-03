<template>
  <v-card flat outlined class="card-container">
    <header>
      <div class="text-h6 font-weight-bold text-uppercase">{{ room.roomName }}</div>
      <p class="text-subtitle-2 font-weight-regular">
        <price-slot
          ><template #price>{{ room.rate }}</template></price-slot
        >
        {{ ` | ${room.capacity} max occupancy` }}
      </p>
    </header>

    <section>
      <p class="mb-4 text-body-2 font-weight-regular">
        {{ room.description }}
      </p>
    </section>

    <v-divider />

    <section class="mt-2">
      <div class="text-overline font-weight-bold">Amenities:</div>
      <div class="grid-container">
        <div
          class="text-muted text-caption font-weight-regular"
          v-for="(i, index) in room.amenities"
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
  props: { room: Object },
  components: { PriceSlot },
  data: () => ({}),
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
