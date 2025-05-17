import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const addOns = {
  namespaced: true,
  state: () => ({
    addOns: null,
    loading: {
      dialog: false,
    },
  }),
  getters: {},
  mutations: {
    SET_ADDONS: (state, data) => (state.addOns = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    fetchAddOns: function ({ commit }) {
      const url = `addon`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ADDONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching addOns: ", error);
        });
    },
  },
};
