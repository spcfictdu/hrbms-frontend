import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/guest",
    component: () =>
      import(
        /* webpackChunkName: "guest" */ "../../views/guest-user/GuestHeaderView"
      ),
    children: [
      // Hotel Rooms
      {
        path: "",
        name: "Guest Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "guest-dashboard" */ "@/views/guest-user/hotel-rooms/GuestDashboardView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: true,
          name: "Hotel Rooms",
        },
      },
      {
        path: "room-details/:referenceNumber",
        name: "Guest Room Category",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "guest-room-details" */ "@/views/guest-user/hotel-rooms/GuestRoomDetailsView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Hotel Rooms",
        },
      },
      {
        path: "booking",
        name: "Guest Booking",
        component: () =>
          import(
            /* webpackChunkName: "guest-booking" */ "@/views/guest-user/hotel-rooms/GuestBookingView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Booking",
        },
      },
      {
        path: "confirmation/:referenceNumber",
        name: "Guest Confirmation",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "guest-confirmation" */ "@/views/guest-user/hotel-rooms/GuestConfirmationView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Booking",
        },
      },
      {
        path: "check-in-out/:referenceNumber",
        name: "Guest CheckInOut",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "guest-check-in-out" */ "@/views/guest-user/hotel-rooms/GuestCheckInOutView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Check In & Out",
        },
      },

      // Account Section
      {
        path: "account",
        name: "Guest Account Details",
        component: () =>
          import(
            /* webpackChunkName: "guest-account" */ "@/views/guest-user/account/AccountView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Account",
        },
      },
      {
        path: "account/edit-details",
        name: "Guest Edit Details",
        component: () =>
          import(
            /* webpackChunkName: "guest-edit-details" */ "@/views/guest-user/account/EditDetailsView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Edit Details",
        },
      },
      // More Paths
    ],
  },
];
