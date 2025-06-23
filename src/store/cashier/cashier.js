import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const cashier = {
  namespaced: true,
  state: () => ({
    sessions: [],
    currUserHistory: [],
  }),
  getters: {},
  mutations: {
    SET_SESSIONS: (state, data) => (state.sessions = data),
    SET_CURR_USER_HISTORY: (state, data) => (state.currUserHistory = data),
  },
  actions: {
    fetchSessions({ commit }) {
      const url = `cashier-session?status=ACTIVE`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_SESSIONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching sessions: ", error);
        });
    },
    fetchHistory({ commit }, userId) {
      const url = `cashier-session/${userId}/show-history`;
      return this.$axios
        .get(url)
        .then((response) => {
          console.log(response);
          commit("SET_CURR_USER_HISTORY", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching cashier history: ", error);
        });
    },
  },
};
