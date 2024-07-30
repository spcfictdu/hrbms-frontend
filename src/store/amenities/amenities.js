import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const amenities = {
  namespaced: true,
  state: () => ({
    amenities: [],
    procedureStatus: {
      message: "",
      status: "",
    },
    amenityDialog: false,
    meta: {
      title: "amenities",
      loading: false,
    },
    activator: false,
  }),
  getters: {},
  mutations: {
    SET_AMENITIES: (state, data) => (state.amenities = data),
    SET_PROCEDURE_STATUS: (state, data) => (state.procedureStatus = data),
    SET_AMENITY_DIALOG: (state, data) => (state.amenityDialog = data),
    SET_LOADING: (state, data) => (state.meta.loading = data),
    SET_ACTIVATOR: (state, data) => (state.activator = data),
  },
  actions: {
    triggerDialog: function ({ commit }, value) {
      commit("SET_ACTIVATOR", value);
    },
    triggerLoading: function ({ commit }, value) {
      commit("SET_LOADING", value);
    },
    resetDialog: function ({ dispatch }) {
      dispatch("triggerLoading", false).then(() => {
        dispatch("triggerDialog", false);
      });
    },
    triggerAmenityDialog: function ({ commit }, value) {
      commit("SET_AMENITY_DIALOG", value);
    },
    fetchAmenities: function ({ commit }) {
      const url = `amenity`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_AMENITIES", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching amenities: ", error);
        });
    },
    createAmenity: function ({ commit, dispatch }, data) {
      const url = `amenity/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          dispatch("fetchAmenities", data);
          console.log(response.data.message);
          commit("SET_PROCEDURE_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("triggerLoading", false);
          dispatch("triggerAmenityDialog", false);
        })
        .catch((error) => {
          console.error("Error adding amenity: ", error);
          commit("SET_PROCEDURE_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
          dispatch("triggerLoading", false);
          dispatch("triggerAmenityDialog", false);
        });
    },
    updateAmenity: function ({ commit, dispatch }, { refNum, data }) {
      const url = `amenity/update/${refNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchAmenities", refNum);
          console.log(response.data.message);
          commit("SET_PROCEDURE_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("resetDialog");
        })
        .catch((error) => {
          console.error("Error updating amenity: ", error);
          commit("SET_PROCEDURE_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
          dispatch("resetDialog");
        });
    },
    deleteAmenity: function ({ commit, dispatch }, refNum) {
      const url = `amenity/delete/${refNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          dispatch("fetchAmenities", refNum);
          console.log(response.data.message);
          commit("SET_PROCEDURE_STATUS", {
            message: response.data.message,
            status: "success",
          });
          dispatch("resetDialog");
        })
        .catch((error) => {
          console.error("Error deleting amenity: ", error);
          commit("SET_PROCEDURE_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
          dispatch("resetDialog");
        });
    },
  },
};
