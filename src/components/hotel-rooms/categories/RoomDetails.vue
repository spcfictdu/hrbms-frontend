<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <room-info v-if="category" :room="room" />
      </v-col>
      <v-col cols="12" md="4">
        <room-reservation-form />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomInfo from "./RoomInfo.vue";
import RoomReservationForm from "./RoomReservationForm.vue";
export default {
  name: "RoomDetails",
  components: { RoomInfo, RoomReservationForm },
  props: {
    category: Object,
  },
  data: () => ({}),
  computed: {
    room: function () {
      const category = this.category;
      let room = {
        name: category.name,
        price: category.price,
        maxOccupancy: category.capacity,
        description: category.description,
        amenities: category.amenities,
        prices: [
          {
            rate: "Regular Rate",
            sunday: category.rates.regular.sunday,
            monday: category.rates.regular.monday,
            tuesday: category.rates.regular.tuesday,
            wednesday: category.rates.regular.wednesday,
            thursday: category.rates.regular.thursday,
            friday: category.rates.regular.friday,
            saturday: category.rates.regular.saturday,
            referenceNumber: category.rates.regular.referenceNumber,
          },
        ],
        rooms: category.rooms.map((key) => ({
          name: key.roomNumber,
          floor: "Floor 1",
          guest: key.guest ? key.guest : "None",
          status: key.status,
        })),
      };

      category.rates.special.forEach((key) => {
        room.prices.push({
          rate: key.discountName,
          startDate: key.startDate,
          endDate: key.endDate,
          referenceNumber: key.referenceNumber,
          sunday: key.sunday,
          monday: key.monday,
          tuesday: key.tuesday,
          wednesday: key.wednesday,
          thursday: key.thursday,
          friday: key.friday,
          saturday: key.saturday,
          referenceNumber: key.referenceNumber,
        });
      });

      return room;
    },
  },
};
</script>

<style scoped></style>
