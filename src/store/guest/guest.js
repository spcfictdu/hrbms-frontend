import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const guest = {
  namespaced: true,
  state: () => ({
    guests: null,
    guest: null,
    loading: {
      guests: false,
      guest: false,
    },
  }),
  getters: {
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_GUESTS: (state, data) => (state.guests = data),
    SET_GUEST: (state, data) => (state.guest = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    async fetchGuests({ commit }, queryParams = {}) {
      const url = `guest`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "guests", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_GUESTS", data.results);
        return data.results;
      } catch (err) {
        commit("SET_GUESTS", null);
        console.error("Error fetching guests: ", err);
      } finally {
        commit("SET_LOADING", { key: "guests", value: false });
      }
    },
    async fetchGuest({ commit }, { id, queryParams = {} }) {
      const url = `guest/${id}`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "guest", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_GUEST", data.results);
        return data.results;
      } catch (err) {
        commit("SET_GUEST", null);
        console.error("Error fetching guest: ", err);
      } finally {
        commit("SET_LOADING", { key: "guest", value: false });
      }
    },
    deleteGuest: function ({ dispatch }, id) {
      const url = `guest/delete/${id}`;
      return this.$axios
        .delete(url)
        .then(() => {
          this.$router.replace({
            name: "Guests",
          });
          dispatch("transaction/fetchTransactions", id, { root: true });
        })
        .catch(() => {
          this.$router.replace({
            name: "Guests",
          });
        });
    },
  },
};
