import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const addOns = {
  namespaced: true,
  state: () => ({
    addOns: null,
    loading: {
      dialog: false,
    },
    selectedAddOn: null,
  }),
  getters: {},
  mutations: {
    SET_ADDONS: (state, data) => (state.addOns = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    SET_SELECTED_ADDON: (state, addOn) => (state.selectedAddOn = addOn),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    fetchAddOns: function ({ commit }) {
      const url = `addon`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ADDONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching addOns: ", error);
        });
    },
    createAddOn({ dispatch }, data) {
      const url = `addon/create`;
      return this.$axios
        .post(url, data)
        .then((response) => {
          dispatch("fetchAddOns");
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error adding add-on: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateAddOn({ dispatch }, { refNum, data }) {
      const url = `addon/update/${refNum}`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          dispatch("fetchAddOns");
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating add-on: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    deleteAddOn({ dispatch }, refNum) {
      const url = `addon/delete/${refNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          dispatch("fetchAddOns");
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error deleting add-on: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    setSelectedAddOn: ({ commit }, addOn) =>
      commit("SET_SELECTED_ADDON", addOn),
  },
};
