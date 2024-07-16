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
    categoryStatus: {
      message: "",
      status: "", //SUCCESS, ERROR
    },
    meta: {
      title: "Categories",
      loading: false,
    },
  }),
  getters: {},
  mutations: {
    SET_ROOM_CATEGORIES: (state, data) => (state.roomCategories = data),
    SET_ROOM_CATEGORY: (state, data) => (state.roomCategory = data),
    SET_CATEGORY_STATUS: (state, data) => {
      state.categoryStatus = data;
      let interval = setInterval(() => {
        state.categoryStatus = {
          message: "",
          status: "",
        };
        clearInterval(interval);
      }, 3000);
    },
    SET_LOADING: (state, data) => (state.meta.loading = data),
  },
  actions: {
    triggerLoading: function ({ commit }, value) {
      commit("SET_LOADING", value);
    },
    fetchRoomCategories: function ({ commit, dispatch }, queryParams = {}) {
      const url = `room-type`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM_CATEGORIES", response.data.results);
          dispatch("triggerLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching room categories", error);
        });
    },
    fetchRoomCategory: function ({ commit, state }, { roomTypeReferenceNumber }) {
      state.roomCategory = null;
      
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
    createRoomCategory: function ({ commit }, payload) {
      const url = `room-type/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          this.$router.push({ name: "Room Categories" });
          commit("SET_CATEGORY_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
        })
        .catch((error) => {
          console.error("Error creating room category: ", error);
          commit("SET_CATEGORY_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    deleteRoomCategory: function ({ commit, _ }, { roomTypeReferenceNumber }) {
      const url = `room-type/delete/${roomTypeReferenceNumber}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          this.$router.push({ name: "Room Categories" });
          commit("SET_CATEGORY_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
          // dispatch("fetchRoomCategories");
        })
        .catch((error) => {
          console.error("Error deleting room category: ", error);
          commit("SET_CATEGORY_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    updateRoomCategory: function (
      { commit },
      { roomTypeReferenceNumber, payload }
    ) {
      // // Log the key/value pairs
      // for (var pair of payload.entries()) {
      //   console.log(pair[0] + " - " + pair[1]);
      // }
      const url = `room-type/update/${roomTypeReferenceNumber}`;
      return this.$axios
        .post(url, payload, {
          // headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          this.$router.push({ name: "Room Categories" });
          commit("SET_CATEGORY_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
        })
        .catch((error) => {
          console.error("Error updating room category: ", error);
          commit("SET_CATEGORY_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
  },
};
