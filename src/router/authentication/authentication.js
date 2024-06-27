import SignInView from "@/views/authentication/SignInView.vue";
import GuestSignInView from "../../views/authentication/GuestSignInView.vue";

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/sign-in",
    name: "Guest Sign In",
    component: GuestSignInView,
    meta: {
      name: "Guest Sign In",
      isLogin: true,
    },
  },
  {
    path: "/sign-in/admin",
    name: "Sign In",
    component: SignInView,
    meta: {
      name: "Sign In",
      isLogin: true,
    },
  },
];
