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
      onlyAdmin: true,
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
    path: "/cashier-transactions/:drawerNumber/:id",
    name: "Cashier Transaction List",
    component: () => import("@/views/cashier/CashierTransactionListView.vue"),
    props: true,
    meta: {
      name: "Cashier Transaction List",
      selectedMainNav: "Cashier Terminal",
    },
  },
  {
    path: "/cashier-transactions/:drawerNumber/:id/:paymentId",
    name: "Cashier Transaction Details",
    component: () =>
      import("@/views/cashier/CashierTransactionDetailsView.vue"),
    props: true,
    meta: {
      name: "Cashier Transaction Details",
      selectedMainNav: "Cashier Terminal",
    },
  },
];
