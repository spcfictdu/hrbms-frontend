import Vue from "vue";
import Vuex from "vuex";
import store from "..";

Vue.use(Vuex);

export const roomRates = {
  namespaced: true,
  state: () => ({
    ratesStatus: {
      message: "",
      status: "", //SUCCESS, ERROR
    },
  }),
  getter: {},
  mutations: { SET_RATE_STATUS: (state, data) => (state.ratesStatus = data) },
  actions: {
    createSpecialRoomRate: function (
      { commit },
      { payload, roomTypeReferenceNumber }
    ) {
      const url = `room-type/rate/special/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          commit("SET_RATE_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
          store.dispatch("roomCategories/fetchRoomCategory", {
            roomTypeReferenceNumber: roomTypeReferenceNumber,
          });
        })
        .catch((error) => {
          console.error("Error creating special rate: ", error);
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    deleteSpecialRoomRate: function (
      { commit },
      { roomTypeReferenceNumber, roomTypeRateReferenceNumber }
    ) {
      const url = `room-type/rate/special/archive/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          commit("SET_RATE_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
          store.dispatch("roomCategories/fetchRoomCategory", {
            roomTypeReferenceNumber: roomTypeReferenceNumber,
          });
        })
        .catch((error) => {
          console.error("Error deleting special rate: ", error);
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    updateRegularRoomRate: function (
      { commit },
      { roomTypeReferenceNumber, roomTypeRateReferenceNumber, payload }
    ) {
      console.log(roomTypeRateReferenceNumber);
      const url = `room-type/rate/regular/update/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          commit("SET_RATE_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
          store.dispatch("roomCategories/fetchRoomCategory", {
            roomTypeReferenceNumber: roomTypeReferenceNumber,
          });
        })
        .catch((error) => {
          console.error("Error updating regular room rate: ", error);
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    updateSpecialRoomRate: function (
      { commit },
      { roomTypeReferenceNumber, roomTypeRateReferenceNumber, payload }
    ) {
      const url = `room-type/rate/special/update/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          commit("SET_RATE_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
          store.dispatch("roomCategories/fetchRoomCategory", {
            roomTypeReferenceNumber: roomTypeReferenceNumber,
          });
        })
        .catch((error) => {
          console.error("Error updating special room rate: ", error);
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
  },
};
