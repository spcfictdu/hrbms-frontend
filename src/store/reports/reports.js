import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const reports = {
  namespaced: true,
  state: () => ({
    guestReports: null,
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
  },
  mutations: {
    SET_GUEST_REPORTS: (state, data) => (state.guestReports = data),
  },
  actions: {
    async fetchGuestReports({ commit }, queryParams = {}) {
      const url = `report/daily-reservations`;
      const queryUrl = functions.query(url, queryParams);

      try {
        const response = await this.$axios.get(queryUrl);
        commit("SET_GUEST_REPORTS", response.data.data);
        return response;
      } catch (err) {
        commit("SET_GUEST_REPORTS", null);
        console.error(`Error fetching guest reports: ${err}`);
        return err.response.data;
      }
    },
  },
};
