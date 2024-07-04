import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/admin",
    name: "Dashboard",
    component: () => import(
      /* webpackChunkName: "dashboard" */ "@/views/dashboard/DashboardView.vue"
      ),
  },
];