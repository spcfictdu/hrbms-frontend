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
    SET_ROOM_NUMBERS: (state, data) => (state.roomNumberEnum = data),
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

export const roomEnum = {
  // Query Params include roomType, roomNumber, dateRange, extraPersonCount
  namespaced: true,
  state: () => ({
    room: null,
  }),
  getters: {},
  mutations: {
    SET_ROOM: (state, data) => (state.room = data),
  },
  actions: {
    fetchRoom: function ({ commit }, queryParams = {}) {
      const url = `enum/room`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room: ", error);
        });
    },
  },
};

export const rateTypeEnum = {
  namespaced: true,
  state: () => ({
    rateType: null,
  }),
  getters: {},
  mutations: {
    SET_RATE_TYPE: (state, data) => (state.rateType = data),
  },
  actions: {
    fetchRateType: function ({ commit }, queryParams = {}) {
      const url = `enum/room-type-rate`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_RATE_TYPE", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching rate type: ", error);
        });
    },
  },
};

export const availableRoomNumbersEnum = {
  namespaced: true,
  state: () => ({
    availableRoomNumbersEnum: null,
  }),
  getters: {},
  mutations: {
    SET_AVAILABLE_ROOMS: (state, data) =>
      (state.availableRoomNumbersEnum = data),
  },
  actions: {
    fetchAvailableRoomNumbers: function ({ commit }, queryParams = {}) {
      const url = `enum/guest/available-room-numbers`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_AVAILABLE_ROOMS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching available rooms", error);
        });
    },
  },
};
