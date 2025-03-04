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

      // Transactional Routes
      {
        path: "booking",
        name: "Guest Booking",
        component: () =>
          import(
            /* webpackChunkName: "guest-booking" */ "@/views/hotel-rooms/forms/BookingView.vue"
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
        component: () =>
          import(
            /* webpackChunkName: "guest-confirmation" */ "@/views/hotel-rooms/forms/ConfirmationView.vue"
          ),
        props: (route) => ({
          referenceNumber: String(route.params.referenceNumber),
        }),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Booking",
          formBtn: {
            title: "Print",
            outlined: true,
          },
        },
      },
      {
        path: "check-in-out/:referenceNumber",
        name: "Guest CheckInOut",
        component: () =>
          import(
            /* webpackChunkName: "guest-check-in-out" */ "@/views/hotel-rooms/forms/CheckInAndOutView.vue"
          ),
        props: (route) => ({
          referenceNumber: String(route.params.referenceNumber),
        }),
        meta: {
          isGuest: true,
          withSearchEngine: false,
          name: "Check In & Out",
          formBtn: {
            title: "Print",
            outlined: true,
          },
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
