import Vue from "vue";
import VueRouter from "vue-router";
import HotelRoomsView from "../../views/hotel-rooms/HotelRoomsView";
import RoomsListView from "../../views/hotel-rooms/RoomsListView";
import RoomDetailsView from "@/views/hotel-rooms/RoomDetailsView";
import RoomCategoriesView from "@/views/hotel-rooms/RoomCategoriesView";
import AvailabilityView from "../../views/hotel-rooms/AvailabilityView";
import BookingView from "../../views/hotel-rooms/availability/BookingView";
import ConfirmationView from "../../views/hotel-rooms/availability/ConfirmationView";
import CheckInAndOutView from "../../views/hotel-rooms/availability/CheckInAndOutView.vue";

Vue.use(VueRouter);

export default [
  {
    path: "/hotel-rooms",
    component: HotelRoomsView,
    children: [
      {
        path: "",
        name: "Rooms List",
        component: RoomsListView,
        meta: {
          name: "Rooms",
        },
      },
      {
        path: "room-details",
        name: "Room Details",
        component: RoomDetailsView,
        meta: {
          name: "Rooms",
        },
      },
      {
        path: "room-categories",
        name: "Room Categories",
        component: RoomCategoriesView,
        meta: {
          name: "Categories",
        },
      },
      {
        path: "availability",
        name: "Availability",
        component: AvailabilityView,
        meta: {
          name: "Availability",
          hideInputs: true,
        },
      },
      {
        path: "availability/booking",
        name: "Booking",
        component: BookingView,
        meta: {
          name: "Booking",
          hideInputs: true,
        },
      },
      {
        path: "availability/booking/confirmation",
        name: "Confirmation",
        component: ConfirmationView,
        meta: {
          name: "Booking",
          hideInputs: true,
        },
      },
      {
        path: "availability/check-in-out",
        name: "CheckInOut",
        component: CheckInAndOutView,
        meta: {
          name: "Check In & Out",
          hideInputs: true,
        },
      },
    ],
  },
];
