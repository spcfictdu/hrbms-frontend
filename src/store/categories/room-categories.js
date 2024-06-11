import Vue from "vue";
import Vuex from "vuex";
import { functions } from "@/utils/functions";

Vue.use(Vuex);

// fetchRooms queryParams are:
// roomType : STRING (optional) - The type of the room
// page : INTEGER (optional) - The page number
// perPage : INTEGER (optional) - The number of items per page
// sortBy : STRING (optional) - The field to sort by
// sortOrder : STRING (optional) - The order of the sort
// checkInDate : STRING (optional) - The check in date the guest wants to book
// checkOutDate : STRING (optional) - The check out date the guest wants to book
// capacity : STRING (optional) - The capacity of the room

export const roomCategories = {
  namespaced: true,
  state: () => ({
    roomCategories: null,
    roomCategory: null,
  }),
  getters: {},
  mutations: {
    SET_ROOM_CATEGORIES: (state, data) => (state.roomCategories = data),
    SET_ROOM_CATEGORY: (state, data) => (state.roomCategory = data),
  },
  actions: {
    fetchRoomCategories: function ({ commit }, queryParams = {}) {
      const url = `room-type`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM_CATEGORIES", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room categories", error);
        });
    },
    fetchRoomCategory: function ({ commit }, { roomTypeReferenceNumber }) {
      const url = `room-type/${roomTypeReferenceNumber}`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ROOM_CATEGORY", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room category: ", error);
        });
    },
  },
};
