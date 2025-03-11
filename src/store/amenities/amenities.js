import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const amenities = {
  namespaced: true,
  state: () => ({
    amenities: null,
    loading: {
      dialog: false,
    },
  }),
  getters: {},
  mutations: {
    SET_AMENITIES: (state, data) => (state.amenities = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
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
    createAmenity: function ({ dispatch }, data) {
      const url = `amenity/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          dispatch("fetchAmenities");
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error adding amenity: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateAmenity: function ({ dispatch }, { refNum, data }) {
      const url = `amenity/update/${refNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchAmenities");
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating amenity: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    deleteAmenity: function ({ commit, dispatch }, refNum) {
      const url = `amenity/delete/${refNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          dispatch("fetchAmenities");
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error deleting amenity: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
  },
};
