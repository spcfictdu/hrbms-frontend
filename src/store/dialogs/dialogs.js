import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const dialogs = {
  namespaced: true,
  state: () => ({
    password: false,
    logout: false,
    amenity_dialog: false,
    amenity_delete: false,
    room_dialog: false,
    room_confirm: false,
    room_delete: false,
    category_delete: false,
    category_rate: false,
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
