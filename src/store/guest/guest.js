import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const guest = {
  namespaced: true,
  state: () => ({
    guests: [],
    guest: {},
    alertProperties: {
      message: "",
      type: "",
    },
  }),
  getters: {},
  mutations: {
    SET_GUESTS: (state, data) => (state.guests = data),
    SET_GUEST: (state, data) => (state.guest = data),
    SET_ALERT_PROPERTIES: (state, data) => (state.alertProperties = data),
  },
  actions: {
    fetchGuests: function ({ commit }, queryParams = {}) {
      const url = `guest`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_GUESTS", response.data.results);
        })
        .catch((error) => {
          commit("SET_ALERT_PROPERTIES", {
            message: error.response.data.message,
            type: "error",
          });
          console.error("Error fetching guests: ", error);
        });
    },
    fetchGuest: function ({ commit }, {id, queryParams = {}}) {
      const url = `guest/${id}`;
      const queryUrl = functions.query(url, queryParams)
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_GUEST", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching guest: ", error);
        });
    },
    deleteGuest: function ({ commit, dispatch }, id) {
      const url = `guest/delete/${id}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          this.$router.replace({
            name: "Guests",
          });
          dispatch("transaction/fetchTransactions", id, { root: true })
          commit("SET_ALERT_PROPERTIES", {
            message: response.data.message,
            type: "success",
          });
        })
        .catch((error) => {
          this.$router.replace({
            name: "Guests",
          });
          commit("SET_ALERT_PROPERTIES", {
            message: error.response.data.message,
            type: "error",
          });
        });
    },
  },
};
