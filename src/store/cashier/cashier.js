import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const cashier = {
  namespaced: true,
  state: () => ({
    sessions: [],
    adjustments: [],
    currUserHistory: null,
    filteredSessions: [],
    dialog: {
      confirmation: false,
      cashierAuth: false,
      cashier: false,
      adminPasscode: false,
    },
    loading: {
      sessions: false,
      currUserHistory: false,
      dialog: false,
    },
    currentCashier: { session: null, drawerNumber: null },
    adjustment: "",
  }),
  getters: {
    getSession: (state) => (userId) =>
      state.sessions.find((s) => Number(userId) === s.userId),
    getCashierAction: (state) =>
      state.currentCashier.session?.status === "ACTIVE" ? "Close" : "Open",
    isCurrentCashierSessionless: (state) => {
      const currentCashier = state.currentCashier;

      const isSessionUndefined = !currentCashier?.session;
      const isSessionLess =
        currentCashier?.session?.message === "User has no cashier sessions";
      return isSessionUndefined || isSessionLess;
    },
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_SESSIONS: (state, data) => (state.sessions = data),
    SET_ADJUSTMENTS: (state, data) => (state.adjustments = data),
    SET_CURR_USER_HISTORY: (state, data) => (state.currUserHistory = data),
    SET_FILTERED_SESSIONS: (state, status) => {
      if (!status) {
        state.filteredSessions = state.sessions;
        return;
      }

      state.filteredSessions = state.sessions.filter((s) => {
        if (status === "INACTIVE") {
          return status === s.status || typeof s.status === "undefined";
        }
        return status === s.status;
      });
    },
    SET_DIALOG: (state, { key, value }) => (state.dialog[key] = value),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    SET_CURRENT_CASHIER: (state, { session, drawerNumber } = {}) => {
      state.currentCashier.session = session;
      state.currentCashier.drawerNumber = drawerNumber;
    },
    SET_ADJUSTMENT: (state, adjustment) => (state.adjustment = adjustment),
  },
  actions: {
    async fetchSessions({ commit }, queryParams = {}) {
      const url = `cashier-session/show-cashiers`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "sessions", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_SESSIONS", data.results);
        return data.results;
      } catch (err) {
        commit("SET_SESSIONS", []);
        console.error("Error fetching sessions: ", err.response.data.message);
      } finally {
        commit("SET_LOADING", { key: "sessions", value: false });
      }
    },

    fetchAdjustments({ commit }, queryParams = {}) {
      const url = `cashier-session`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ADJUSTMENTS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching adjustments: ", error);
        });
    },

    async fetchHistory({ commit }, { userId, queryParams = {} }) {
      const url = `cashier-session/${userId}/show-history`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "currUserHistory", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_CURR_USER_HISTORY", data.results);
        return data.results;
      } catch (err) {
        console.error("Error fetching cashier history: ", err);
      } finally {
        commit("SET_LOADING", { key: "currUserHistory", value: false });
      }
    },

    async startSession({ commit, dispatch }, { userId, payload }) {
      const url = `cashier-session/start/${userId}`;

      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.post(url, payload);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        return response;
      } catch (err) {
        console.error(err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },

    async closeSession({ commit, dispatch }, { userId, payload }) {
      const url = `cashier-session/close/${userId}`;

      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.post(url, payload);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        return response;
      } catch (err) {
        console.error(err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },
  },
};
