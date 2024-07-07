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
            /* webpackChunkName: "guest-dashboard" */ "@/views/guest-user/dashboard/GuestDashboardView.vue"
            ),
        meta: {
          isGuest: true,
          withSearchEngine: true,
          name: "Hotel Rooms",
        },
      },
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
