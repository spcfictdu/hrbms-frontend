import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const roomPrice = {
  namespaced: true,
  state: () => ({
    roomPrice: null,
  }),
  getter: {},
  mutations: {
    SET_ROOM_PRICE: (state, data) => (state.roomPrice = data),
  },
  actions: {
    fetchRoomPrice: function ({ commit }) {
      const url = `room-type/rate`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOM_PRICE", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room price: ", error);
        });
    },
  },
};
