import SignInView from "@/views/authentication/SignInView.vue";
import RegisterView from "@/views/authentication/RegisterView.vue";
import GuestSignInView from "../../views/authentication/GuestSignInView.vue";

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/sign-in",
    name: "Guest Sign In",
    component: GuestSignInView,
    props: (route) => ({
      method: route.query.method,
    }),
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
  {
    path: "/register/admin",
    name: "Register",
    component: RegisterView,
    meta: {
      name: "Register",
      isLogin: true,
    },
  },
];
