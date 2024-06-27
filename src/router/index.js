import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/utils/auth";

import roomsList from "./hotel-rooms/rooms-list";
import guestList from "./guest-list/guest-list";
import transaction from "./transaction/transaction";
import authentication from "./authentication/authentication";
import publicRoutes from "@/router/public-routes/public-routes";
import dashboardRoutes from "./dashboard/dashboard";

Vue.use(VueRouter);

const routes = [
  ...dashboardRoutes,
  ...roomsList,
  ...guestList,
  ...transaction,
  ...authentication,
  ...publicRoutes,
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach((to, from, next) => {
  let loggedIn = auth.user();
  const signInRoutes = ["Sign In", "Guest Sign In"];
  const allowedPublicRoutes = [
    ...publicRoutes[0].children.filter(({ meta }) => meta.isPublic).map(({ name }) => name),
    ...signInRoutes,
  ];

  if (!loggedIn && !allowedPublicRoutes.includes(to.name)) {
    return next({ name: "Guest Sign In" });
  } else if (loggedIn && signInRoutes.includes(to.name)) {
    return next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
