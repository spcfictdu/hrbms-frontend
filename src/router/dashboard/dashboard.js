import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/",
    name: "Public Dashboard",
    component: () => import(
      /* webpackChunkName: "public-dashboard" */ "@/views/public/dashboard/PublicDashboardView.vue"
      ),
    meta: {
      name: "Hotel Rooms",
    }
  },
  {
    path: "/admin",
    name: "Dashboard",
    component: () => import(
      /* webpackChunkName: "dashboard" */ "@/views/dashboard/DashboardView.vue"
      ),
  },
  {
    path: "/guest",
    name: "Guest Dashboard",
    component: () => import(
      /* webpackChunkName: "guest-dashboard" */ "@/views/dashboard/GuestDashboardView.vue"
      ),
  },

];