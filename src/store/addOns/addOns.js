import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const addOns = {
  namespaced: true,
  state: () => ({
    addOns: [],
    loading: {
      addons: false,
      dialog: false,
    },
    selectedAddOn: null,
  }),
  getters: {
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_ADDONS: (state, data) => (state.addOns = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    SET_SELECTED_ADDON: (state, addOn) => (state.selectedAddOn = addOn),
    ADD_ADDON: (state, addon) => {
      state.addOns.push(addon);
    },
    UPDATE_ADDON: (state, { referenceNumber, data }) => {
      const index = state.addOns.findIndex(
        (a) => a.referenceNumber === referenceNumber
      );
      if (index !== -1) {
        Vue.set(state.addOns, index, { ...state.addOns[index], ...data });
      }
    },
    DELETE_ADDON: (state, referenceNumber) => {
      state.addOns = state.addOns.filter(
        (a) => a.referenceNumber !== referenceNumber
      );
    },
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    async fetchAddOns({ commit }) {
      const url = `addon`;

      commit("SET_LOADING", { key: "addons", value: true });
      try {
        const { data } = await this.$axios.get(url);
        commit("SET_ADDONS", data.results);
        return data.results;
      } catch (err) {
        console.error("Error fetching addons: ", err.response.data.message);
      } finally {
        commit("SET_LOADING", { key: "addons", value: false });
      }
    },
    async createAddOn({ commit, dispatch }, data) {
      const url = `addon/create`;

      dispatch("alerts/requireAlertFn", 2, { root: true });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.post(url, data);
        commit("ADD_ADDON", response.data.results);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        return response.data.results;
      } catch (err) {
        console.error("Error fetching addons: ", err.response.data.message);
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        });
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },
    async updateAddOn({ commit, dispatch }, { refNum, data }) {
      const url = `addon/update/${refNum}`;

      dispatch("alerts/requireAlertFn", 2, { root: true });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.put(url, data);
        commit("UPDATE_ADDON", { referenceNumber: refNum, data });
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        return response.data.results;
      } catch (err) {
        console.error("Error updating addons: ", err.response.data.message);
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        });
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },
    async deleteAddOn({ commit, dispatch }, refNum) {
      const url = `addon/delete/${refNum}`;

      dispatch("alerts/requireAlertFn", 2, { root: true });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.delete(url);
        commit("DELETE_ADDON", refNum);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        return response.data.results;
      } catch (err) {
        console.error("Error deleting addons: ", err.response.data.message);
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        });
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
      }
    },
    setSelectedAddOn: ({ commit }, addOn) =>
      commit("SET_SELECTED_ADDON", addOn),
  },
};
