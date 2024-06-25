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
    name: "Dashboard",
    component: () =>
      import(
        /* webpackChunkName: "index" */ "@/views/dashboard/DashboardView.vue"
      ),
  },
  ...roomsList,
  ...guestList,
  ...transaction,
  ...authentication,
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach((to, from, next) => {
  const routes = ["Sign In", "Guest Sign In"];
  let loggedIn = auth.user();
  if (!loggedIn && !routes.includes(to.name)) {
    next({ name: to.name });
  } else if (loggedIn && routes.includes(to.name)) {
    return next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
