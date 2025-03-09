import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const dialogs = {
  namespaced: true,
  state: () => ({
    password: false,
  }),
  getters: {},
  mutations: {
    SET_DIALOG: (state, { key, value }) => (state[key] = value),
  },
  actions: {
    setDialogFn: function ({ commit }, { key, value }) {
      commit("SET_DIALOG", { key, value });
    },
  },
};
