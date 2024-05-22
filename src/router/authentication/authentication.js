import SignInView from "@/views/authentication/SignInView.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

export default [
    {
        path: '/sign-in',
        name: "Sign In",
        component: SignInView,
        meta: {
            name: "Sign In"
        }
    }
]