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
      roomCategories: false,
      roomCategory: false,
      delete: false,
      form: false,
    },
  }),
  getters: {
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_ROOM_CATEGORIES: (state, data) => (state.roomCategories = data),
    SET_ROOM_CATEGORY: (state, data) => (state.roomCategory = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    async fetchRoomCategories({ commit }, queryParams = {}) {
      const url = `room-type`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "roomCategories", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_ROOM_CATEGORIES", data.results);
        return data.results;
      } catch (err) {
        commit("SET_ROOM_CATEGORIES", null);
        console.error(
          "Error fetching room categories: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "roomCategories", value: false });
      }
    },
    async fetchRoomCategory({ commit }, roomTypeReferenceNumber) {
      const url = `room-type/${roomTypeReferenceNumber}`;

      commit("SET_LOADING", { key: "roomCategory", value: true });
      try {
        const { data } = await this.$axios.get(url);
        commit("SET_ROOM_CATEGORY", data.results);
        return data.results;
      } catch (err) {
        commit("SET_ROOM_CATEGORY", null);
        console.error(
          "Error fetching room categories: ",
          err.response.data.message
        );
      } finally {
        commit("SET_LOADING", { key: "roomCategory", value: false });
      }
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
