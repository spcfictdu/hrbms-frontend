import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const roomPrice = {
  namespaced: true,
  state: () => ({
    roomPrice: null,
    roomTypePrice: null,
  }),
  getter: {},
  mutations: {
    SET_ROOM_PRICE: (state, data) => (state.roomPrice = data),
    SET_ROOM_TYPE_PRICE: (state, data) => (state.roomTypePrice = data),
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
    fetchRoomTypePrice: function ({ commit }, referenceNumber) {
      const url = `room-type/rate/${referenceNumber}`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOM_TYPE_PRICE", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room type price: ", error);
        });
    },
    updateRegularRate: function ({ dispatch }, { regularRefNum, data, roomTypeRefNum }) {
      const url = `room-type/rate/regular/update/${regularRefNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchRoomTypePrice", roomTypeRefNum);
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error updating regular rates: ", error);
        });
    },
    updateSpecialRate: function ({ dispatch }, { specialRefNum, data, roomTypeRefNum }) {
      const url = `room-type/rate/special/update/${specialRefNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchRoomTypePrice", roomTypeRefNum);
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error updating special rates: ", error);
        });
    },
  },
};
