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
    addOn_dialog: false,
    addOn_delete: false,
    room_dialog: false,
    room_confirm: false,
    room_delete: false,
    category_delete: false,
    category_rate: false,
    dialog_message: null,
  }),
  getters: {
    openedDialogKey: (state) => {
      for (const key in state) {
        if (state[key] === true) return key;
      }
    },
  },
  mutations: {
    SET_DIALOG: (state, { key, value }) => (state[key] = value),
    SET_DIALOG_MESSAGE: (state, message) => (state.dialog_message = message),
  },
  actions: {
    setDialogFn: function ({ commit }, { key, value }) {
      commit("SET_DIALOG", { key, value });
    },
    setDialogMessage: ({ commit }, message) =>
      commit("SET_DIALOG_MESSAGE", message),
  },
};
