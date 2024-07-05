import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/",
    component: () =>
      import(
        /* webpackChunkName: "public-routes" */ "@/views/public/PublicHeaderView.vue"
      ),
    children: [
      {
        path: "",
        name: "Public Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "public-routes" */ "@/views/public/dashboard/PublicDashboardView.vue"
          ),
        meta: {
          name: "Hotel Rooms",
          isPublic: true,
          withSearchEngine: true,
        },
      },
      {
        path: "room-type/:referenceNumber",
        name: "Public Room Category",
        component: () =>
          import(
            /* webpackChunkName: "public-routes" */ "@/views/public/rooms/category/RoomDetailsView.vue"
          ),
        props: true,
        meta: {
          name: "Hotel Rooms",
          isPublic: true,
          withSearchEngine: false,
        },
      },
      {
        path: "booking",
        name: "Public Booking",
        component: () =>
          import(
            /* webpackChunkName: "public-routes" */ "@/views/hotel-rooms/forms/BookingView.vue"
          ),
        props: true,
        meta: {
          name: "Booking",
          isPublic: true,
          withSearchEngine: false,
        },
      }
    ],
  },
];