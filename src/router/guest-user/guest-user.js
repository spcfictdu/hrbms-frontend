import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/guest",
    component: () =>
      import(
        /* webpackChunkName: "guest-dashboard" */ "../../views/guest-user/GuestHeaderView"
      ),
    children: [
      {
        path: "",
        name: "Guest Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "guest-dashboard" */ "@/views/dashboard/GuestDashboardView.vue"
          ),
        meta: {
          isGuest: true,
          withSearchEngine: true,
          name: 'Hotel Rooms'
        },
      },
      // More Paths
    ],
  },
];
