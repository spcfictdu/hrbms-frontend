import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default [
  {
    path: "/reports",
    name: "Reports",
    component: () =>
      import(
        /* webpackChunkName: "reports" */ "@/views/reports/ReportsView.vue"
      ),
    meta: {
      name: "Reports",
      selectedMainNav: "Reports",
    },
    children: [
      {
        path: "guests",
        name: "GuestReports",
        component: () =>
          import(
            /* webpackChunkName: "guestReports" */ "@/views/reports/GuestReportsView.vue"
          ),
        meta: {
          name: "Reports",
          selectedMainNav: "Reports",
        },
      },
      {
        path: "flights",
        name: "FlightReports",
        component: () =>
          import(
            /* webpackChunkName: "flightReports" */ "@/views/reports/FlightReportsView.vue"
          ),
        meta: {
          name: "Reports",
          selectedMainNav: "Reports",
        },
      },
      {
        path: "cashiers",
        name: "CashierReports",
        component: () =>
          import(
            /* webpackChunkName: "cashierReports" */ "@/views/reports/CashierReportsView.vue"
          ),
        meta: {
          name: "Reports",
          selectedMainNav: "Reports",
        },
      },
    ],
  },
  {
    path: "/cashier-reports/:cashierSessionId/:date",
    name: "CashierReport",
    component: () =>
      import(
        /* webpackChunkName: "cashierReport" */ "@/views/reports/CashierReportView.vue"
      ),
    meta: {
      selectedMainNav: "Reports",
    },
    props: true,
  },
  {
    path: "/billing-report/:transactionRefNum",
    name: "Billing Report",
    component: () =>
      import(
        /* webpackChunkName: "billingReport" */ "@/views/reports/BillingReportView.vue"
      ),
    props: true,
    meta: {
      name: "Billing Report",
    },
  },
];
