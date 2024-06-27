import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/",
    component: () => import(
      /* webpackChunkName: public-routes */ "@/views/public/PublicHeaderView.vue"
      ),
    children: [
      {
        path: "",
        name: "Public Dashboard",
        component: () => import("@/views/public/dashboard/PublicDashboardView.vue"),
        meta: {
          name: "Hotel Rooms",
          isPublic: true,
        },
      },
    ],
  }
]