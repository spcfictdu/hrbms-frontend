import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const occupied = {
  namespaced: true,
  state: () => ({
    roomStatus: {},
    messageProperties: {
      type: "",
      message: "",
    },
    createRoomDialog: false,
  }),
  getters: {},
  mutations: {
    SET_ROOM_STATUS: (state, data) => (state.roomStatus = data),
    SET_MESSAGE_PROPERTIES: (state, data) => (state.messageProperties = data),
    SET_CREATE_ROOM_DIALOG: (state, data) => (state.createRoomDialog = data),
  },
  actions: {
    fetchRoomStatus: function ({ commit }, queryParams = {}) {
      const url = `room-status`;
      const queryUrl = functions.query(url, queryParams)
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
    updateRoomStatus: function ({ dispatch, commit }, { roomRefNum, data }) {
      const url = `room-status/update/${roomRefNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchRoomStatus", roomRefNum);
          commit("SET_MESSAGE_PROPERTIES", {
            message: response.data.message,
            type: "success",
          });
          console.log(response.data.message);
        })
        .catch((error) => {
          commit("SET_MESSAGE_PROPERTIES", {
            message: response.data.message,
            type: "error",
          });
          console.error(error.response.data.message);
        });
    },
    triggerOccupiedDialog: function ({ commit }, value) {
      commit("SET_CREATE_ROOM_DIALOG", value);
    },
  },
};

