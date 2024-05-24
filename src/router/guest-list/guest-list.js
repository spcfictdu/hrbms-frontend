import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/guests",
    name: "Guests",
    component: () =>
      import(
        "@/views/guest-list/GuestListView.vue"
      ),
    meta: {
      name: "Guests"
    }
  },
  {
    path: "/guests/:id",
    name: "guest",
    component: () =>
      import(
        "@/components/guests/GuestDetails.vue"
      ),
      props: true, 
  }
];
