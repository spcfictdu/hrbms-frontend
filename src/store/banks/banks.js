import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const banks = {
  namespaced: true,
  state: () => ({
    banks: [],
  }),
  getters: {
    getBank: (state) => (id) => state.banks.find((b) => b.id === id),
  },
  mutations: {
    SET_BANKS: (state, data) => (state.banks = data),
  },
  actions: {
    async fetchBanks({ commit }) {
      const url = "bank";

      try {
        const { data } = await this.$axios.get(url);
        commit("SET_BANKS", data.results);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
