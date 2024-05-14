import Vue from "vue";
import VueRouter from "vue-router";
import HotelRoomsView from "../../views/hotel-rooms/HotelRoomsView";
import AvailabilityView from "../../views/hotel-rooms/AvailabilityView";

Vue.use(VueRouter);

export default [
  {
    path: "/rooms",
    name: "Rooms",
    component: HotelRoomsView,
    meta: {
      name: "Hotel Rooms",
    },
    children: [
      {
        path: "availability",
        name: "Availability",
        component: AvailabilityView,
        meta: {
          name: "Availability"
        }
      },
    ],
  },
];
