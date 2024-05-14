<template>
  <div>
    <div class="card w-full" v-for="(room, index) in rooms" :key="index">
      <img
        src="../../assets/hotelRoom.png"
        alt="hotel room"
        class="room-images"
      />
      <div class="card-text">
        <div>
          <p class="text-h5 font-weight-bold mb-0">{{ room.name }}</p>
          <p class="text-subtitle-2">
            <span class="text-overline font-weight-bold">{{
              room.category
            }}</span
            >{{ ` | ${room.maxOccupancy} max occupancy` }}
          </p>
        </div>

        <div>
          <p class="text-subtitle-2 font-weight-bold longText--text mb-0">
            {{ `${room.name} offers the following amenities:` }}
          </p>
          <div class="amenities-wrapper">
            <p
              v-for="(amenity, index) in room.amenities"
              :key="'amenity' + index"
              class="text-subtitle-2 font-weight-regular longText--text mb-0"
            >
              {{ amenity }}
            </p>
          </div>
        </div>

        <v-divider class="my-3"/>

        <div class="card-actions">
            <v-btn rounded color="primary" small class="ml-auto"> View Details</v-btn>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomCard",
  props: { rooms: Array },
  data: () => ({
    hello: "world",
  }),
};
</script>

<style scoped>
.card {
  height: 215px;
  background-color: #fcfcfc;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: start;
  gap: 2rem;
}

.room-images {
  height: 100%;
  width: 250px;
  object-fit: cover;
  border-radius: 10px;
}

.card-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.amenities-wrapper{
    display: flex;
    gap: 3rem;
}

.card-actions{
    width: 100%;
    display: flex;
    justify-content: end;
}
</style>
