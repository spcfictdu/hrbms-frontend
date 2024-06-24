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

export const rooms = {
  namespaced: true,
  state: () => ({
    rooms: null,
    alertProperties: {
      message: "",
      type: "",
    },
  }),
  getters: {},
  mutations: {
    SET_ROOMS: (state, data) => (state.rooms = data),
    SET_ALERT_PROPERTIES: (state, data) => (state.alertProperties = data),
  },
  actions: {
    fetchRooms: function ({ commit }, queryParams = {}) {
      const url = `room`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOMS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching rooms", error);
        });
    },
    createRoom: function ({ commit, dispatch }, data) {
      const url = `room/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          dispatch("occupied/fetchRoomStatus", data, { root: true });
          commit("SET_ALERT_PROPERTIES", {
            message: response.data.message,
            type: "success",
          });
          console.log(response.data.message);
        })
        .catch((error) => {
          commit("SET_ALERT_PROPERTIES", {
            message: error.response.data.message,
            type: "error",
          });
          console.error(error.response.data.message);
        });
    },
  },
};
