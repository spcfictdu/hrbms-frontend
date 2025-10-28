import Vue from "vue";
import Vuex from "vuex";
import { functions } from "@/utils/functions";

Vue.use(Vuex);

export const occupied = {
  namespaced: true,
  state: () => ({
    roomStatuses: null,
    loading: {
      roomStatuses: false,
      roomStatus: false,
      room: false,
    },
    roomSearchQuery: "",
  }),
  getters: {
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_ROOM_STATUS: (state, data) => (state.roomStatuses = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    SET_ROOM_SEARCH_QUERY: (state, roomNumber) =>
      (state.roomSearchQuery = roomNumber),
  },
  actions: {
    async fetchRoomStatus({ commit }, queryParams = {}) {
      const url = `room-status`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "roomStatuses", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_ROOM_STATUS", data.results);
        return data.results;
      } catch (err) {
        commit("SET_ROOM_STATUS", null);
        console.error(
          "Error fetching room statuses: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "roomStatuses", value: false });
      }
    },
    async updateRoomStatus({ commit, dispatch }, { roomRefNum, data }) {
      const url = `room-status/update/${roomRefNum}`;

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "roomStatus", value: true });
      try {
        const { data: roomStatus } = await this.$axios.put(url, data);
        dispatch("alerts/triggerSuccess", roomStatus.message, {
          root: true,
        });
        return roomStatus;
      } catch (err) {
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        console.error(
          "Error updating room status: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "roomStatus", value: false });
      }
    },

    // Rooms Configuration
    async createRoom({ commit, dispatch }, { data }) {
      const url = `room/create`;

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "room", value: true });
      try {
        const { data: room } = await this.$axios.post(url, data);
        dispatch("alerts/triggerSuccess", room.message, {
          root: true,
        });
        return room;
      } catch (err) {
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        console.error(
          "Error creating room status: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "room", value: false });
      }
    },
    async deleteRoom({ commit, dispatch }, { refNum }) {
      const url = `room/delete/${refNum}`;

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "room", value: true });
      try {
        const { data: room } = await this.$axios.delete(url);
        dispatch("alerts/triggerSuccess", room.message, {
          root: true,
        });
        return room;
      } catch (err) {
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        console.error(
          "Error creating room status: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "room", value: false });
      }
    },
    async updateRoom({ commit, dispatch }, { refNum, data }) {
      const url = `room/update/${refNum}`;

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "room", value: true });
      try {
        const { data: room } = await this.$axios.put(url, data);
        dispatch("alerts/triggerSuccess", room.message, {
          root: true,
        });
        return room;
      } catch (err) {
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        console.error(
          "Error creating room status: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "room", value: false });
      }
    },
  },
};
