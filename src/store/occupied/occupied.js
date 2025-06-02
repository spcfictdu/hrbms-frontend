import Vue from "vue";
import Vuex from "vuex";
import { functions } from "@/utils/functions";

Vue.use(Vuex);

export const occupied = {
  namespaced: true,
  state: () => ({
    roomStatuses: null,
    loading: {
      fetch: false,
      dialog: false,
      delete: false,
      confirm: false,
    },
    roomSearchQuery: "",
  }),
  getters: {},
  mutations: {
    SET_ROOM_STATUS: (state, data) => (state.roomStatuses = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    SET_ROOM_SEARCH_QUERY: (state, roomNumber) =>
      (state.roomSearchQuery = roomNumber),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    fetchRoomStatus: function ({ dispatch, commit }, queryParams = {}) {
      const url = `room-status`;
      dispatch("setLoading", { key: "fetch", value: true });

      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM_STATUS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room status: ", error);
        })
        .finally(() => {
          dispatch("setLoading", { key: "fetch", value: false });
        });
    },
    updateRoomStatus: function (_, { roomRefNum, data }) {
      const url = `room-status/update/${roomRefNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error(error.response.data.message);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },

    // Rooms Configuration
    createRoom: function (_, { data }) {
      const url = `room/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error creating room", error.response.data.message);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    deleteRoom: function (_, { refNum }) {
      const url = `room/delete/${refNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error(error.response.data.message);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateRoom: function (_, { refNum, data }) {
      const url = `room/update/${refNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error(error.response.data.message);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
  },
};
