import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const reports = {
  namespaced: true,
  state: () => ({
    guestReports: null,
    flightReports: {
      arrivals: [],
      departures: [],
    },
    cashierReports: [],
    guestBillingReport: null,
    loading: {
      guestReports: false,
      flightReports: false,
      cashierReports: false,
      guestBillingReport: false,
    },
  }),
  getters: {
    expectedCheckIns: (state) => state.guestReports?.expectedCheckIns || [],
    actualCheckIns: (state) => state.guestReports?.actualCheckIns || [],

    expectedCheckOuts: (state) => state.guestReports?.expectedCheckOuts || [],
    actualCheckOuts: (state) => state.guestReports?.actualCheckOuts || [],

    inHouse: (state) => state.guestReports?.inHouse || [],

    reportDate: (state) => state.guestReports?.date || null,

    allCheckIns: (state) => ({
      expected: state.guestReports?.expectedCheckIns || [],
      actual: state.guestReports?.actualCheckIns || [],
    }),

    allCheckOuts: (state) => ({
      expected: state.guestReports?.expectedCheckOuts || [],
      actual: state.guestReports?.actualCheckOuts || [],
    }),

    arrivals: (state) => state.flightReports.arrivals,
    departures: (state) => state.flightReports.departures,

    getCashierReport: (state) => (id) =>
      state.cashierReports.find(
        ({ cashierSessionId }) => cashierSessionId === Number(id)
      ),

    isGuestLoading: (state) => state.loading.guestReports,
    isCashierLoading: (state) => state.loading.cashierReports,
    isFlightLoading: (state) => state.loading.flightReports,
  },
  mutations: {
    SET_GUEST_REPORTS: (state, data) => (state.guestReports = data),
    SET_FLIGHT_REPORTS: (state, { arrivals, departures }) => {
      state.flightReports.arrivals = arrivals;
      state.flightReports.departures = departures;
    },
    RESET_FLIGHT_REPORTS: (state) => {
      state.flightReports.arrivals.length = 0;
      state.flightReports.departures.length = 0;
    },
    SET_CASHIER_REPORTS: (state, data) => (state.cashierReports = data),
    SET_LOADING(state, { key, value }) {
      state.loading[key] = value;
    },
    SET_GUEST_BILLING_REPORT: (state, data) =>
      (state.guestBillingReport = data),
  },

  actions: {
    async fetchGuestBillingReport({ commit }, transactionRefNum) {
      const url = `report/guest-billing/${transactionRefNum}`;
      commit("SET_LOADING", { key: "guestBillingReport", value: true });

      try {
        const { data } = await this.$axios.get(url);
        commit("SET_GUEST_BILLING_REPORT", data);
        return data;
      } catch (err) {
        commit("SET_GUEST_BILLING_REPORT", null);
        console.error(`Error fetching guest billing report: ${err}`);
        return err.response?.data;
      } finally {
        commit("SET_LOADING", { key: "guestBillingReport", value: false });
      }
    },

    async fetchCashierReports({ commit }, queryParams) {
      const url = "report/daily-cashier";
      commit("SET_LOADING", { key: "cashierReports", value: true });

      try {
        const { data } = await this.$axios.get(url, { params: queryParams });
        const cashierReports = data.data.slice(1);
        commit("SET_CASHIER_REPORTS", cashierReports);
        return cashierReports;
      } catch (err) {
        commit("SET_CASHIER_REPORTS", []);
        console.error(`Error fetching cashier reports: ${err}`);
        return err.response?.data;
      } finally {
        commit("SET_LOADING", { key: "cashierReports", value: false });
      }
    },

    async fetchGuestReports({ commit }, queryParams = {}) {
      const url = `report/daily-reservations`;
      const queryUrl = functions.query(url, queryParams);
      commit("SET_LOADING", { key: "guestReports", value: true });

      try {
        const response = await this.$axios.get(queryUrl);
        commit("SET_GUEST_REPORTS", response.data.data);
        return response;
      } catch (err) {
        commit("SET_GUEST_REPORTS", null);
        console.error(`Error fetching guest reports: ${err}`);
        return err.response?.data;
      } finally {
        commit("SET_LOADING", { key: "guestReports", value: false });
      }
    },

    async fetchFlightReports({ commit }, queryParams = {}) {
      const url = `report/flights-report`;
      const queryUrl = functions.query(url, queryParams);
      commit("SET_LOADING", { key: "flightReports", value: true });

      try {
        const response = await this.$axios.get(queryUrl);
        const [arrivals, departures] = Object.values(response.data);
        commit("SET_FLIGHT_REPORTS", { arrivals, departures });
        return response;
      } catch (err) {
        commit("SET_FLIGHT_REPORTS", { arrivals: [], departures: [] });
        console.error(`Error fetching flight reports: ${err}`);
        return err.response?.data;
      } finally {
        commit("SET_LOADING", { key: "flightReports", value: false });
      }
    },
  },
};
