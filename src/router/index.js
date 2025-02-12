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

const mappedRoutes = {
  publicRoutes: [
    ...authentication.map(({ name }) => name),
    ...publicRoutes[0].children.map(({ name }) => name),
  ],
  authRoutes: [...authentication.map(({ name }) => name)],
  roleRoutes: {
    GUEST: [...guestUser[0].children.map(({ name }) => name)],
    ADMIN: [
      ...dashboardRoutes.map(({ name }) => name),
      ...roomsList[0].children.map(({ name }) => name),
      ...guestList.map(({ name }) => name),
      ...transaction.map(({ name }) => name),
    ],
  },
};

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
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const loggedIn = auth.user();
  const userRole = auth.user() ? auth.user().role : null;
  const DASHBOARD_NAME = {
    GUEST: "Public Dashboard",
    ADMIN: "Dashboard",
  };

  if (!loggedIn && !mappedRoutes.publicRoutes.includes(to.name)) {
    next({ name: "Public Dashboard" });
    return;
  }

  if (loggedIn && mappedRoutes.authRoutes.includes(to.name)) {
    next({ name: DASHBOARD_NAME[userRole] });
    return;
  }

  const allowedRoutes = [...(mappedRoutes.roleRoutes[userRole] || [])];

  if (!allowedRoutes.includes(to.name)) {
    next({ name: DASHBOARD_NAME[userRole] });
    return;
  }

  next();
});

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = `${to.name} | HRMS`;
  });
});

export default router;