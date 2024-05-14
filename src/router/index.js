import Vue from "vue";
import VueRouter from "vue-router";
import roomsList from "./hotel-rooms/rooms-list";
import guestList from "./guest-list/guest-list";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/DashboardView.vue"),
  },

  ...roomsList,
  ...guestList
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
