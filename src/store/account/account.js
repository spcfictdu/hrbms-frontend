import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const account = {
  namespaced: true,
  state: () => ({
    accountInfo: null,
  }),
  getters: {},
  mutations: {
    SET_ACCOUNT_INFO: (state, data) => (state.accountInfo = data),
  },
  actions: {
    fetchAccountInfo: function ({ commit }, userId) {
      const url = `guest/account`;
      return this.$axios.get(url)
        .then((response) => {
          commit("SET_ACCOUNT_INFO", response.data.results);
        }).catch((error) => {
          console.error("Error fetching account information", error);
        })
    }
  },
}