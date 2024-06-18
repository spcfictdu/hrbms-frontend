import Vue from "vue";
import VueRouter from "vue-router";
import HotelRoomsView from "../../views/hotel-rooms/HotelRoomsView";
import AmenitiesView from "../../views/hotel-rooms/AmenitiesView";
import RoomDetailsView from "../../views/hotel-rooms/categories/RoomDetailsView";
import CategoriesView from "../../views/hotel-rooms/CategoriesView";
import AvailabilityView from "../../views/hotel-rooms/AvailabilityView";
import BookingView from "../../views/hotel-rooms/availability/BookingView";
import ConfirmationView from "../../views/hotel-rooms/availability/ConfirmationView";
import CheckInAndOutView from "../../views/hotel-rooms/availability/CheckInAndOutView.vue";
import CreateRoomView from "../../views/hotel-rooms/CreateRoomView.vue";
import OccupiedRoomsView from "../../views/hotel-rooms/occupied/OccupiedRoomsView.vue";

Vue.use(VueRouter);

export default [
  {
    path: "/hotel-rooms",
    component: HotelRoomsView,
    children: [
      // Amenities
      {
        path: "amenities",
        name: "Amenities",
        component: AmenitiesView,
        meta: {
          name: "Amenities",
        },
      },
      // Occupied
      {
        path: "occupied-rooms",
        name: "Occupied Rooms",
        component: OccupiedRoomsView,
        meta: {
          name: "Occupied Rooms",
        },
      },
      // Categories
      {
        path: "room-categories",
        name: "Room Categories",
        component: CategoriesView,
        meta: {
          name: "Room Categories",
        },
      },
      {
        path: "room-details/:roomCategoryReferenceNumber",
        name: "Room Details",
        component: RoomDetailsView,
        props: true,
        meta: {
          name: "Room Categories",
        },
      },
      {
        path: "create-room-category",
        name: "Create Room",
        component: CreateRoomView,
        meta: {
          name: "Room Categories",
        },
      },
      // Availability
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
        path: "availability/confirmation/:referenceNumber",
        name: "Confirmation",
        component: ConfirmationView,
        props: true,
        meta: {
          name: "Booking",
          hideInputs: true,
        },
      },
      {
        path: "availability/check-in-out/:referenceNumber",
        name: "CheckInOut",
        component: CheckInAndOutView,
        props: true,
        meta: {
          name: "Check In & Out",
          hideInputs: true,
        },
      },
    ],
  },
];
