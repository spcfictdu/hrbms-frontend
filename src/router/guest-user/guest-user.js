import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/guest",
    // Component here
    children: [
      {
        path: "",
        name: "Guest Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "guest-dashboard" */ "@/views/dashboard/GuestDashboardView.vue"
          ),
        meta: {
          isPublic: true,
          withSearchEngine: true,
        }
      },
      // More Paths
    ],
  },
];
