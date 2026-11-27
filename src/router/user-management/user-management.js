import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/users",
    name: "User Management",
    component: () => import("@/views/user-management/UserManagementView.vue"),
    meta: {
      name: "User Management",
      selectedMainNav: "Users",
    },
  },
];
