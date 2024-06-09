<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <room-info :room="room"/>
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
  data: () => ({
    room: {
      name: "Family Rooms",
      price: 1000,
      maxOccupancy: 2,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, natus quam possimus cumque error itaque odio et ullam suscipit, aperiam fugit numquam temporibus voluptate ducimus. Accusantium odio impedit temporibus eum.",
      amenities: [
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom with toiletries",
        "Private outdoor space",
        "Spectacular views",
        "Luxurious bedding",
        "Modern bathroom",
        "Private space",
      ],
      headers: [
        {
          text: "Rates (in peso)",
          value: "rate",
        },
        {
          text: "Sun",
          value: "sunday",
        },
        {
          text: "Mon",
          value: "monday",
        },
        {
          text: "Tue",
          value: "tuesday",
        },
        {
          text: "Wed",
          value: "wednesday",
        },
        {
          text: "Thu",
          value: "thursday",
        },
        {
          text: "Fri",
          value: "friday",
        },
        {
          text: "Sat",
          value: "saturday",
        },
      ],
      prices: [
        {
          rate: "Regular rate",
          sunday: 1000,
          monday: 1000,
          tuesday: 1000,
          wednesday: 1000,
          thursday: 1000,
          friday: 1000,
          saturday: 1000,
        },
        {
          rate: "Special rate",
          sunday: 700,
          monday: 700,
          tuesday: 700,
          wednesday: 700,
          thursday: 700,
          friday: 700,
          saturday: 700,
        },
      ],
      rooms: [
        {
          name: "Room 1",
          floor: "Floor 1",
          guest: "Juan Dela Cruz",
          status: "OCCUPIED",
        },
        {
          name: "Room 2",
          floor: "Floor 1",
          guest: "Fernando Poe Jr.",
          status: "OCCUPIED",
        },
      ]
    },
  }),
};
</script>

<style scoped></style>
