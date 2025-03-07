import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const addonsEnum = {
  namespaced: true,
  state: () => ({
    addons: null,
  }),
  getters: {},
  mutations: {
    SET_ADDONS: (state, data) => (state.addons = data),
  },
  actions: {
    fetchAddons: function ({ commit }) {  
      const url = `addon`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ADDONS", response.data);
        })
        .catch((error) => {
          console.error("Error fetching addons: ", error);
        });
    },
  },
};
