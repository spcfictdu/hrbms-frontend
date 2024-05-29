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
  }),
  getters: {},
  mutations: {
    SET_CALENDAR: (state, data) => (state.calendar = data),
  },
  actions: {
    fetchAvailabilityCalendar: function ({ commit }, queryParams = {}) {
      const url = `availability-calendar`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_CALENDAR", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching calendar: ", error);
        });
    },
  },
};
