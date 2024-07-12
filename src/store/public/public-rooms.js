import Vue from "vue";
import Vuex from "vuex";
import { functions } from "@/utils/functions";

Vue.use(Vuex);

export const publicRooms = {
  namespaced: true,
  state: () => ({
    rooms: null,
    filteredRooms: null,
    room: null,
    meta: {
      title: "Rooms",
      loading: false,
    },
    temporaryData: null,
  }),
  getters: {},
  mutations: {
    SET_ROOMS: (state, data) => (state.rooms = data),
    SET_FILTERED_ROOMS: (state, data) => (state.filteredRooms = data),
    SET_ROOM: (state, data) => (state.room = data),
    SET_LOADING: (state, data) => (state.meta.loading = data),
    SET_TEMPORARY_DATA: (state, data) => (state.temporaryData = data),
  },
  actions: {
    fetchPublicRooms: function ({ commit }) {
      const url = `hotel-room`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOMS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching public rooms", error);
        });
    },
    fetchFilteredPublicRoom: function ({ commit, dispatch }, queryParams = {}) {
      const url = `hotel-room/search`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_FILTERED_ROOMS", response.data.results);
          // Reset Loading
          dispatch("resetLoading");
        })
        .catch((error) => {
          console.error("Error fetching filtered rooms", error);
        });
    },
    fetchPublicRoom: function ({ commit }, referenceNumber) {
      const url = `hotel-room/${referenceNumber}`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOM", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room", error);
        });
    },
    storeTemporaryData: function ({ commit }, payload) {
      return commit("SET_TEMPORARY_DATA", payload);
    },
    triggerLoading: function ({ commit }) {
      commit("SET_LOADING", true);
    },
    resetLoading: function ({ commit }) {
      commit("SET_LOADING", false);
    },
    clearTempData({ commit }) {
      commit("SET_TEMPORARY_DATA", null);
    },
  },
};

// Query Parameters for Filtering Rooms
// - checkInDate : STRING (optional) - The check in date the guest wants to book
// - checkOutDate : STRING (optional) - The check out date the guest wants to book
// - capacity : STRING (optional) - The capacity of the room
// - roomType : STRING (optional) - The type of the room
// - page : INTEGER (optional) - The page number
// - perPage : INTEGER (optional) - The number of items per page
// - sortBy : STRING (optional) - The field to sort by
// - sortOrder : STRING (optional) - The order of the sort
