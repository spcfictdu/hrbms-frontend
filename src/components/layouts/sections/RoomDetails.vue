<template>
  <div>
    <v-row>
      <!-- Information -->
      <v-col cols="12" md="8">
        <room-info
          :room="room"
          @validation-event="$emit('validation-event', $event)"
          @delete-event="$emit('delete-event')"
        />
      </v-col>
      <v-col cols="12" md="4">
        <room-reservation-form
          @reservation-event="(e) => $emit('reservation-event', e)"
          :roomCategory="room.name"
          :queryFill="queryFill"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RoomInfo from "@/components/hotel-rooms/categories/RoomInfo.vue";
import RoomReservationForm from "@/components/hotel-rooms/categories/RoomReservationForm.vue";
import { mapState } from "vuex";
export default {
  name: "RoomDetails",
  components: { RoomInfo, RoomReservationForm },
  props: {
    category: Object,
    queryFill: Object,
  },
  data: () => ({}),
  methods: {},
  computed: {
    ...mapState("roomRates", {
      ratesStatus: "ratesStatus",
    }),
    room: function () {
      const category = this.category;
      let room = {
        referenceNumber: category.referenceNumber,
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
