import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/cashier",
    name: "Cashier",
    component: () => import("@/views/cashier/CashierView.vue"),
    meta: {
      name: "Cashier",
      selectedMainNav: "Cashier",
    },
  },
  {
    path: "/cashier/:drawerNumber/:id",
    name: "Cashier History",
    component: () => import("@/views/cashier/CashierHistoryView.vue"),
    props: true,
    meta: {
      name: "Cashier History",
      selectedMainNav: "Cashiers",
    },
  },
];
