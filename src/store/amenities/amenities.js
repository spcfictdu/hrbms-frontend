import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const amenities = {
  namespaced: true,
  state: () => ({
    amenities: [],
    loading: {
      amenities: false,
      dialog: false,
    },
    activeAmenitiesTab: "Amenities",
    selectedAmenity: null,
  }),
  getters: {
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_AMENITIES: (state, data) => (state.amenities = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    SET_ACTIVE_AMENITIES_TAB: (state, tab) => (state.activeAmenitiesTab = tab),
    SET_SELECTED_AMENITY: (state, amenity) => (state.selectedAmenity = amenity),
    ADD_AMENITY: (state, amenity) => {
      state.amenities.push(amenity);
    },
    UPDATE_AMENITY: (state, { referenceNumber, data }) => {
      const index = state.amenities.findIndex(
        (a) => a.referenceNumber === referenceNumber
      );
      if (index !== -1) {
        Vue.set(state.amenities, index, { ...state.amenities[index], ...data });
      }
    },
    DELETE_AMENITY: (state, referenceNumber) => {
      state.amenities = state.amenities.filter(
        (a) => a.referenceNumber !== referenceNumber
      );
    },
  },
  actions: {
    async fetchAmenities({ commit }) {
      const url = `amenity`;

      commit("SET_LOADING", { key: "amenities", value: true });
      try {
        const { data } = await this.$axios.get(url);
        commit("SET_AMENITIES", data.results);
        return data.results;
      } catch (err) {
        commit("SET_AMENITIES", []);
        console.error("Error fetching amenities: ", err);
      } finally {
        commit("SET_LOADING", { key: "amenities", value: false });
      }
    },

    async createAmenity({ commit, dispatch }, data) {
      const url = `amenity/create`;

      dispatch("alerts/requireAlertFn", 2, { root: true });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.post(url, data);
        commit("ADD_AMENITY", response.data.results);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
      } catch (err) {
        console.error("Error adding amenity: ", err);
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        });
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },

    async updateAmenity({ commit, dispatch }, payload) {
      const { refNum, data } = payload;
      const url = `amenity/update/${refNum}`;

      dispatch("alerts/requireAlertFn", 2, { root: true });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.put(url, data);
        commit("UPDATE_AMENITY", { referenceNumber: refNum, data });
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
      } catch (err) {
        console.error("Error updating amenity: ", err);
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        });
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },

    async deleteAmenity({ commit, dispatch }, refNum) {
      const url = `amenity/delete/${refNum}`;

      dispatch("alerts/requireAlertFn", 2, { root: true });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.delete(url);
        // Optimistic delete
        commit("DELETE_AMENITY", refNum);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
      } catch (err) {
        console.error("Error deleting amenity: ", err);
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        });
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },

    setActiveAmenitiesTab: ({ commit }, tab) =>
      commit("SET_ACTIVE_AMENITIES_TAB", tab),
    setSelectedAmenity: ({ commit }, amenity) =>
      commit("SET_SELECTED_AMENITY", amenity),
  },
};
