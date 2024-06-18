import Vue from "vue";
import VueRouter from "vue-router";
import TransactionView from "@/views/transactions/TransactionView.vue";

Vue.use(VueRouter);

export default [
  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionView,
    meta: {
      name: "Transactions",
      selectedMainNav: "Transactions",
    },
  },
];
