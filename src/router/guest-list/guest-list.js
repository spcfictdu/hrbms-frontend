import Vue from "vue";
import VueRouter from "vue-router";
import GuestListView from "@/views/guest-list/GuestListView.vue";
import GuestDetails from "@/components/guests/GuestDetails.vue";

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
  {
    path: "/guests/:id",
    name: "guest",
    component: GuestDetails,
  }
];
