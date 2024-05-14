import Vue from "vue";
import VueRouter from "vue-router";
import GuestListView from "@/views/guest-list/GuestListView.vue";

Vue.use(VueRouter);

export default [
  {
    path: "/guests",
    name: "Guests",
    component: GuestListView,
    meta: {
      name: "Guests"
    }
  },
];
