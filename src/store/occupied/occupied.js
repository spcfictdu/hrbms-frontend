import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const occupied = {
  namespaced: true,
  state: () => ({
    roomStatus: {},
  }),
  getters: {},
  mutations: {
    SET_ROOM_STATUS: (state, data) => (state.roomStatus = data),
  },
  actions: {
    fetchRoomStatus: function ({ commit }) {
      const url = `room-status`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOM_STATUS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room status: ", error);
        });
    },
  },
};
