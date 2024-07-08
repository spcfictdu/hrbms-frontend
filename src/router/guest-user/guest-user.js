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
            /* webpackChunkName: "guest" */ "@/views/guest-user/hotel-rooms/GuestDashboardView.vue"
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
            /* webpackChunkName: "guest" */ "@/views/guest-user/hotel-rooms/GuestRoomDetailsView.vue"
            ),
        meta: {
          withSearchEngine: false,
          name: "Hotel Rooms",
        },
      },
      {
        path: "booking",
        name: "Guest Booking",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "guest" */ "@/views/guest-user/hotel-rooms/GuestBookingView.vue"
            ),
        meta: {
          withSearchEngine: false,
          name: "Booking",
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
            /* webpackChunkName: "guest-account" */ "@/views/guest-user/account/EditDetailsView.vue"
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
