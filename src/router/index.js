import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/utils/auth";

import roomsList from "./hotel-rooms/rooms-list";
import guestList from "./guest-list/guest-list";
import transaction from "./transaction/transaction";
import authentication from "./authentication/authentication";
import publicRoutes from "@/router/public-routes/public-routes";
import dashboardRoutes from "./dashboard/dashboard";
import guestUser from "./guest-user/guest-user";

Vue.use(VueRouter);

const routes = [
  ...dashboardRoutes,
  ...roomsList,
  ...guestList,
  ...transaction,
  ...authentication,
  ...publicRoutes,
  ...guestUser,
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
  const loggedIn = auth.user();
  const userRole = auth.user() ? auth.user().role : null;

  if (!loggedIn && !allowedRoutes("PUBLIC").includes(to.name)) {
     next({ name: "Guest Dashboard" });
  } else if (loggedIn && allowedRoutes("LOGIN").includes(to.name)) {
    if (userRole === "GUEST") {
       next({ name: "Guest Dashboard" });
    } else if (userRole === "ADMIN") {
       next({ name: "Dashboard" });
    }
  } else if (userRole === "GUEST" && !allowedRoutes("GUEST").includes(to.name)) {
    next({ name: "Guest Dashboard" });
  } else if (userRole === "ADMIN" && !allowedRoutes("ADMIN").includes(to.name)) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

function allowedRoutes (type) {
 let data = [];
  if (type === "LOGIN") {
    // Sign In Routes
    data = ["Sign In", "Guest Sign In"];
  } else if (type === "PUBLIC") {
    // Public Routes
    data = [
      ...publicRoutes[0].children.filter(({ meta }) => meta.isPublic).map(({ name }) => name),
      "Sign In", "Guest Sign In",
    ]
  } else if (type === "GUEST") {
    // Guest User Routes
    data = [
      ...guestUser[0].children.map(({name}) => name),
    ]
  } else if (type === "ADMIN") {
    // Admin User Routes
    data = [
      ...dashboardRoutes.map(({name}) => name),
      ...roomsList[0].children.map(({name}) => name),
      ...guestList.map(({name}) => name),
      ...transaction.map(({name}) => name),
    ]
  }
 return data;
}

export default router;