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
    meta: {
      title: "",
      loading: false,
    },
    rateDialog: false,
  }),
  getter: {},
  mutations: {
    SET_RATE_STATUS: (state, data) => {
      state.ratesStatus = data;
      let interval = setInterval(() => {
        state.ratesStatus = {
          message: "",
          status: "",
        };
        clearInterval(interval);
      }, 3000);
    },
    SET_RATE_DIALOG: (state, data) => (state.rateDialog = data),
    SET_META: (state, data) => (state.meta = data),
  },
  actions: {
    triggerDialog: function ({ commit }, value) {
      commit("SET_RATE_DIALOG", value);
    },
    triggerRateLoading: function ({ commit }, meta) {
      commit("SET_META", meta);
    },
    resetMetaData: function ({ dispatch }) {
      dispatch("triggerRateLoading", {
        title: "",
        loading: false,
      }).then(() => {
        dispatch("triggerDialog", false);
      });
    },
    createSpecialRoomRate: function (
      { commit, dispatch },
      { payload, roomTypeReferenceNumber }
    ) {
      const url = `room-type/rate/special/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          dispatch("resetMetaData");
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
          dispatch("resetMetaData");
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    deleteSpecialRoomRate: function (
      { commit, dispatch },
      { roomTypeReferenceNumber, roomTypeRateReferenceNumber }
    ) {
      const url = `room-type/rate/special/archive/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          dispatch("resetMetaData");
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
          dispatch("resetMetaData");
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    updateRegularRoomRate: function (
      { commit, dispatch },
      { roomTypeReferenceNumber, roomTypeRateReferenceNumber, payload }
    ) {
      const url = `room-type/rate/regular/update/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          dispatch("resetMetaData");
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
          dispatch("resetMetaData");
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    updateSpecialRoomRate: function (
      { commit, dispatch },
      { roomTypeReferenceNumber, roomTypeRateReferenceNumber, payload }
    ) {
      const url = `room-type/rate/special/update/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          dispatch("resetMetaData");
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
          dispatch("resetMetaData");
          commit("SET_RATE_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
  },
};
