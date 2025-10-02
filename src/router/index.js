import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/utils/auth";
import store from "@/store";

import roomsList from "./hotel-rooms/rooms-list";
import guestList from "./guest-list/guest-list";
import transaction from "./transaction/transaction";
import authentication from "./authentication/authentication";
import publicRoutes from "@/router/public-routes/public-routes";
import dashboardRoutes from "./dashboard/dashboard";
import guestUser from "./guest-user/guest-user";
import cashier from "./cashier/cashier";

Vue.use(VueRouter);

const mappedRoutes = {
  publicRoutes: [
    ...authentication.map(({ name }) => name),
    ...publicRoutes[0].children.map(({ name }) => name),
  ],
  commonRoutes: [...publicRoutes[0].children.map(({ name }) => name)],
  authRoutes: [...authentication.map(({ name }) => name)],
  roleRoutes: {
    GUEST: [...guestUser[0].children.map(({ name }) => name)],
    ADMIN: [
      ...dashboardRoutes.map(({ name }) => name),
      ...roomsList[0].children.map(({ name }) => name),
      ...guestList.map(({ name }) => name),
      ...transaction.map(({ name }) => name),
      ...cashier.map(({ name }) => name),
    ],
    "FRONT DESK": [
      ...dashboardRoutes.map(({ name }) => name),
      ...roomsList[0].children.map(({ name }) => name),
      ...guestList.map(({ name }) => name),
      ...transaction.map(({ name }) => name),
      ...cashier.map(({ name }) => name),
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
  ...cashier,
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

router.beforeEach(async (to, from, next) => {
  const loggedIn = auth.user();
  const userRole = auth.user() ? auth.user().role : null;
  const DASHBOARD_NAME = {
    GUEST: "Public Dashboard",
    ADMIN: "Dashboard",
    "FRONT DESK": "Dashboard",
  };

  const { state, dispatch, getters, commit } = store;

  if (
    loggedIn &&
    userRole === "FRONT DESK" &&
    mappedRoutes.roleRoutes["FRONT DESK"].includes(to.name) &&
    !state.cashier.currentCashier.session &&
    state.cashier.currentCashier.session?.status !== "ACTIVE"
  ) {
    await dispatch("cashier/fetchSessions");
    console.log("router fetch");

    const session = getters["cashier/getSession"](loggedIn.userId);
    commit("cashier/SET_CURRENT_CASHIER", { session });
    const isSessionInactive = getters["cashier/getCashierAction"] === "Open";

    if (isSessionInactive) {
      commit("cashier/SET_DIALOG", { key: "cashierAuth", value: true });
    }
  }

  if (!loggedIn && !mappedRoutes.publicRoutes.includes(to.name)) {
    next({ name: "Public Dashboard" });
    return;
  }

  if (loggedIn && mappedRoutes.authRoutes.includes(to.name)) {
    next({ name: DASHBOARD_NAME[userRole] });
    return;
  }

  const allowedRoutes = [
    ...(mappedRoutes.roleRoutes[userRole] || []),
    ...mappedRoutes.commonRoutes,
  ];

  if (
    !allowedRoutes.includes(to.name) ||
    (userRole === "FRONT DESK" && to.meta.onlyAdmin)
  ) {
    next({ name: DASHBOARD_NAME[userRole] });
    return;
  }

  next();
});

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = `${to.name} | HRBMS`;
  });
});

export default router;
