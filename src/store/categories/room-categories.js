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
    loading: {
      fetch: false,
      delete: false,
      form: false,
    },
  }),
  getters: {},
  mutations: {
    SET_ROOM_CATEGORIES: (state, data) => (state.roomCategories = data),
    SET_ROOM_CATEGORY: (state, data) => (state.roomCategory = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    fetchRoomCategories: function ({ commit, dispatch }, queryParams = {}) {
      const url = `room-type`;
      dispatch("setLoading", { key: "fetch", value: true });

      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_ROOM_CATEGORIES", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching room categories", error);
        })
        .finally(() => {
          dispatch("setLoading", { key: "fetch", value: false });
        });
    },
    fetchRoomCategory: function ({ commit }, roomTypeReferenceNumber) {
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
    createRoomCategory: function (_, payload) {
      const url = `room-type/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          this.$router.push({ name: "Room Categories" });
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error creating room category: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    deleteRoomCategory: function (_, roomTypeReferenceNumber) {
      const url = `room-type/delete/${roomTypeReferenceNumber}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error deleting room category: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateRoomCategory: function (_, { roomTypeReferenceNumber, payload }) {
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
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating room category: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    resetRoomCategory: function ({ commit }) {
      commit("SET_ROOM_CATEGORY", null);
    },
  },
};
