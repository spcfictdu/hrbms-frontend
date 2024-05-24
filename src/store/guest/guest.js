import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const guest = {
  namespaced: true,
  state: () => ({
    guests: [],
    guest: {},
  }),
  getters: {},
  mutations: {
    SET_GUESTS: (state, data) => (state.guests = data),
    SET_GUEST: (state, data) => (state.guest = data),
  },
  actions: {
    fetchGuests: function ({ commit }) {
      const url = `guest`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_GUESTS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching guests: ", error);
        });
    },
    fetchGuest: function ({ commit }, id ) {
      const url = `guest/${id}`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_GUEST", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching guest: ", error);
        });
    },
  },
};
