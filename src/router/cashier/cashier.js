import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/cashier-terminal",
    name: "Cashier Terminal",
    component: () => import("@/views/cashier/CashierTerminalView.vue"),
    meta: {
      name: "Cashier Terminal",
      selectedMainNav: "Cashier Terminal",
    },
  },
  {
    path: "/cashier/:id",
    name: "Cashier",
    component: () => import("@/views/cashier/CashierView.vue"),
    props: true,
    meta: {
      name: "Cashier",
      selectedMainNav: "Cashier Terminal",
      formBtn: {
        title: "Record Payment",
        outlined: false,
      },
    },
  },
  {
    path: "/cashier/:drawerNumber/:id",
    name: "Cashier History",
    component: () => import("@/views/cashier/CashierHistoryView.vue"),
    props: true,
    meta: {
      name: "Cashier History",
      selectedMainNav: "Cashier Terminal",
    },
  },
];
