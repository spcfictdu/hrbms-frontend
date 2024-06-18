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
  }),
  getters: {},
  mutations: {
    SET_AMENITIES: (state, data) => (state.amenities = data),
    SET_PROCEDURE_STATUS: (state, data) => (state.procedureStatus = data),
  },
  actions: {
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
    createAmenity: function ({ _ }, data) {
      const url = `amenity/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error adding amenity: ", error);
        });
    },
    updateAmenity: function ({ commit }, { refNum, data }) {
      const url = `amenity/update/${refNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          console.log(response.data.message);
          commit("SET_PROCEDURE_STATUS", {
            message: response.data.message,
            status: "success",
          });
        })
        .catch((error) => {
          console.error("Error updating amenity: ", error);
          commit("SET_PROCEDURE_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
        });
    },
    deleteAmenity: function ({ commit }, refNum) {
      const url = `amenity/delete/${refNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          console.log(response.data.message);
          commit("SET_PROCEDURE_STATUS", {
            message: response.data.message,
            status: "success",
          });
        })
        .catch((error) => {
          console.error("Error deleting amenity: ", error);
          commit("SET_PROCEDURE_STATUS", {
            message: error.response.data.message,
            status: "error",
          });
        });
    },
  },
};
