import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const roomTypeEnum = {
  namespaced: true,
  state: () => ({
    roomTypeEnum: null,
  }),
  getters: {},
  mutations: {
    SET_ROOM_TYPES: (state, data) => (state.roomTypeEnum = data),
  },
  actions: {
    fetchRoomTypes: function ({ commit }) {
      const url = `enum/room-type`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOM_TYPES", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room type: ", error);
        });
    },
  },
};

export const roomNumberEnum = {
  namespaced: true,
  state: () => ({
    roomNumberEnum: null,
  }),
  getters: {},
  mutations: {
    SET_ROOM_NUMBERS: (state, data) => state.roomNumberEnum = data,
  },
  actions: {
    fetchRoomNumbers: function ({ commit }, queryParams = {}) {
      const url = `enum/room-number`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM_NUMBERS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetchinr room numbers: ", error);
        });
    },
  },
};
