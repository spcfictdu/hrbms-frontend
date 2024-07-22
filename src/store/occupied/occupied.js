import Vue from "vue";
import Vuex from "vuex";
import { functions } from "@/utils/functions";

Vue.use(Vuex);

export const occupied = {
  namespaced: true,
  state: () => ({
    roomStatuses: null,
    occupiedStatus: {
      message: "",
      status: "", //SUCCESS, ERROR
    },
    occupiedDialog: false,
    meta: {
      title: "Room",
      loading: false,
    },
  }),
  getters: {},
  mutations: {
    SET_ROOM_STATUS: (state, data) => (state.roomStatuses = data),
    SET_OCCUPIED_STATUS: (state, data) => {
      state.occupiedStatus = data;
      let interval = setInterval(() => {
        state.occupiedStatus = {
          message: "",
          status: "",
        };
        clearInterval(interval);
      }, 3000);
    },
    SET_OCCUPIED_DIALOG: (state, data) => (state.occupiedDialog = data),
    SET_LOADING: (state, data) => (state.meta.loading = data),
  },
  actions: {
    triggerLoading: function ({ commit }, data) {
      commit("SET_LOADING", data);
    },
    fetchRoomStatus: function ({ commit }, queryParams = {}) {
      const url = `room-status`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM_STATUS", response.data.results);
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error fetching room status: ", error);
        });
    },
    updateRoomStatus: function (
      { dispatch, commit },
      { roomRefNum, data, queryParams = {} }
    ) {
      const url = `room-status/update/${roomRefNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchRoomStatus", queryParams);
          commit("SET_OCCUPIED_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("triggerLoading", false);
        })
        .catch((error) => {
          commit("SET_OCCUPIED_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
          dispatch("triggerLoading", false);
          console.error(error.response.data.message);
        });
    },

    // Dialog
    triggerOccupiedDialog: function ({ commit }, data) {
      commit("SET_OCCUPIED_DIALOG", data);
    },

    // Rooms Configuration
    createRoom: function ({ commit, dispatch }, { data, queryParams = {} }) {
      const url = `room/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          dispatch("fetchRoomStatus", queryParams);
          commit("SET_OCCUPIED_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("triggerLoading", false);
        })
        .catch((error) => {
          commit("SET_OCCUPIED_STATUS", {
            message: error.response.data.results.roomNumber,
            status: "error",
          });
          dispatch("triggerLoading", false);
          console.error("Error creating room", error.response.data.message);
        });
    },
    deleteRoom: function ({ commit, dispatch }, { refNum, queryParams = {} }) {
      const url = `room/delete/${refNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          dispatch("fetchRoomStatus", queryParams);
          commit("SET_OCCUPIED_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("triggerLoading", false);
        })
        .catch((error) => {
          commit("SET_OCCUPIED_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
          dispatch("triggerLoading", false);
          console.error(error.response.data.message);
        });
    },
    updateRoom: function (
      { commit, dispatch },
      { refNum, data, queryParams = {} }
    ) {
      const url = `room/update/${refNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchRoomStatus", queryParams);
          commit("SET_OCCUPIED_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("triggerLoading", false);
        })
        .catch((error) => {
          commit("SET_OCCUPIED_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
          dispatch("triggerLoading", false);
          console.error(error.response.data.message);
        });
    },
  },
};
