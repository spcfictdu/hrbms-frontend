import Vue from "vue";
import VueRouter from "vue-router";
import HotelRoomsView from "../../views/hotel-rooms/HotelRoomsView"

Vue.use(VueRouter);

export default [
  {
    path: "/rooms",
    name: "Rooms",
    component: HotelRoomsView,
    meta: {
        name: "Hotel Rooms"
    }
  },
];