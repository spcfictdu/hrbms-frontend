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
          isPublic: true,
          name: "Hotel Rooms",
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
          isPublic: true,
          name: "Hotel Rooms",
          withSearchEngine: false,
        },
      },
      {
        path: "pencil-booking",
        name: "Public Booking",
        component: () =>
          import(
            /* webpackChunkName: "public-routes" */ "@/views/public/rooms/transactions/PublicBookingView.vue"
          ),
        props: true,
        meta: {
          isPublic: true,
          name: "Booking",
          withSearchEngine: false,
        },
      },
    ],
  },
];
