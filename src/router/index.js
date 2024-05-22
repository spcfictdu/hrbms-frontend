import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/utils/auth";

import roomsList from "./hotel-rooms/rooms-list";
import guestList from "./guest-list/guest-list";
import transaction from "./transaction/transaction";
import authentication from "./authentication/authentication";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/DashboardView.vue"),
  },

  ...roomsList,
  ...guestList,
  ...transaction,
  ...authentication
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let loggedIn = auth.user()
  if (!loggedIn && to.name !== "Sign In") {
    next({ name: "Sign In" })
  } else if (loggedIn && to.name === "Sign In") {
    return next({name: "Rooms List"})
  } else {
    next()
  }
})

export default router;
