import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const transaction = {
  namespaced: true,
  state: () => ({
    transactions: null,
    transaction: null,
    previousTransactions: null,
    loading: {
      dialog: false,
      form: false,
      cancel: false,
      header: false,
    },
  }),
  getters: {},
  mutations: {
    SET_TRANSACTIONS: (state, data) => (state.transactions = data),
    SET_TRANSACTION: (state, data) => (state.transaction = data),
    SET_PREVIOUS_TRANSACTIONS: (state, data) =>
      (state.previousTransactions = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    fetchTransactions: function ({ commit }, queryParams = {}) {
      const url = `transaction`;
      const queryUrl = functions.query(url, queryParams);
      return this.$axios
        .get(queryUrl)
        .then((response) => {
          commit("SET_TRANSACTIONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching transactions: ", error);
          commit("SET_ALERT_PROPERTIES", {
            message: error.response.data.message,
            status: "error",
          });
        });
    },
    fetchTransaction: function ({ commit, state }, referenceNumber) {
      // Reset to null state every fetch transaction
      state.transaction = null;

      // Get the transaction
      const url = `transaction/show/${referenceNumber}`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_TRANSACTION", response.data.results.bookingHistory);
        })
        .catch((error) => {
          console.error("Error fetching transaction: ", error);
        });
    },
    createTransaction: async function ({ dispatch }, payload) {
      const url = `transaction/create`;

      return this.$axios
        .post(url, payload)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
          return response;
        })
        .catch((error) => {
          console.error("Error creating transaction: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
          throw error;
        });
    },
    deleteReservation: function (_, { status, transactionRefNum }) {
      const url = `transaction/reservation/delete/${status}/${transactionRefNum}`;

      return this.$axios
        .delete(url)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
          return response;
        })
        .catch((error) => {
          console.error("Error deleting reservation: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
          throw error;
        });
    },
    updateTransaction: function (_, payload) {
      const url = `transaction/update`;

      return this.$axios
        .put(url, payload)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
          return response;
        })
        .catch((error) => {
          console.error("Error updating transaction: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
          throw error;
        });
    },
    fetchPreviousFormTransactions: function ({ commit }, referenceNumber) {
      const url = `transaction/form/${referenceNumber}`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_PREVIOUS_TRANSACTIONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching form transactions", error);
        });
    },
  },
};
