import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const cashier = {
  namespaced: true,
  state: () => ({
    sessions: [],
  }),
  getters: {},
  mutations: {
    SET_SESSIONS: (state, data) => (state.sessions = data),
  },
  actions: {
    fetchSessions({ commit }) {
      const url = `cashier-session/?status=ACTIVE`;
      // const url = `cashier-session`;
      return this.$axios
        .get(url)
        .then((response) => {
          console.log(response);
          commit("SET_SESSIONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching sessions: ", error);
        });
    },
  },
};
