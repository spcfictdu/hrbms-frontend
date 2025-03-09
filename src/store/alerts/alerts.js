import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const alerts = {
  namespaced: true,
  state: () => ({
    requireAlert: [],
    alert: false,
    alertMeta: {
      message: "",
      status: "", // success, error, warning
    },
    alertTimeout: null,
  }),
  getters: {},
  mutations: {
    SET_ALERT(state, meta) {
      state.alert = true;
      state.alertMeta = meta;

      if (state.alertTimeout) {
        clearTimeout(state.alertTimeout);
      }

      state.alertTimeout = setTimeout(() => {
        state.requireAlert = false;
        state.alert = false;
        state.alertMeta = {
          message: "",
          status: "",
        };
      }, 3000);
    },
    CLEAR_ALERT(state) {
      state.requireAlert = false;
      state.alert = false;
      state.alertMeta = {
        message: "",
        status: "",
      };
    },
    SET_REQUIRE_ALERT(state, statuses) {
      state.requireAlert = statuses;
    },
  },
  actions: {
    requireAlertFn: function ({ commit }, statusCode) {
      // statusCode: 1, 2, 3
      const whichStatuses = {
        1: ["success"],
        2: ["success", "error"],
        3: ["success", "error", "warning"],
      };
      commit("SET_REQUIRE_ALERT", whichStatuses[statusCode]);
    },
    triggerSuccess: function ({ commit }, message) {
      commit("SET_ALERT", { message, status: "success" });
    },
    triggerError: function ({ commit }, message) {
      commit("SET_ALERT", { message, status: "error" });
    },
    triggerWarning: function ({ commit }, message) {
      commit("SET_ALERT", { message, status: "warning" });
    },
    clearAlert: function ({ commit }) {
      commit("CLEAR_ALERT");
    },
  },
};
