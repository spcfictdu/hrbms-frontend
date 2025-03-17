import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/guests",
    name: "Guests",
    component: () => import("@/views/guest-list/GuestListView.vue"),
    meta: {
      name: "Guests",
      selectedMainNav: "Guests",
    },
  },
  {
    path: "/guests/:id",
    name: "guest",
    component: () => import("@/views/guest-list/GuestDetailsView.vue"),
    props: (route) => ({ id: String(route.params.id) }),
    meta: {
      name: "Guest Details",
      selectedMainNav: "Guests",
    },
  },
];
