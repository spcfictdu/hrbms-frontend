import Vue from "vue";
import Vuex from "vuex";

// Query Params
// roomType, roomNumber, dateRange

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const availabilityCalendar = {
  namespaced: true,
  state: () => ({
    calendar: null,
    meta: {
      title: "Calendar",
      loading: false,
    },
  }),
  getters: {},
  mutations: {
    SET_CALENDAR: (state, data) => (state.calendar = data),
    SET_LOADING: (state, data) => (state.meta.loading = data),
  },
  actions: {
    fetchAvailabilityCalendar: function ({ commit, dispatch }, queryParams = {}) {
      const url = `availability-calendar`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_CALENDAR", response.data.results);
          dispatch("triggerLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching calendar: ", error);
        });
    },
    triggerLoading: function ({ commit }, value) {
      commit("SET_LOADING", value);
    },
  },
};
