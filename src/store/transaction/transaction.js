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
    transactionStatus: {
      message: "",
      status: "", // SUCCESS, ERROR
    },
    loading: {
      dialog: false,
      form: false,
      cancel: false,
    },
  }),
  getters: {},
  mutations: {
    SET_TRANSACTIONS: (state, data) => (state.transactions = data),
    SET_TRANSACTION: (state, data) => (state.transaction = data),
    SET_TRANSACTION_STATUS: (state, data) => (state.transactionStatus = data),
    SET_PREVIOUS_TRANSACTIONS: (state, data) =>
      (state.previousTransactions = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    triggerLoading: function ({ commit }, key) {
      commit("SET_LOADING", {
        key,
        value: true,
      });
    },
    resetLoading: function ({ commit }, key) {
      commit("SET_LOADING", {
        key,
        value: false,
      });
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
      dispatch("triggerLoading", "dialog");

      return this.$axios
        .post(url, payload)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error creating transaction: ", error);
          throw error;
        })
        .finally(() => {
          dispatch("resetLoading", "dialog");
        });
    },
    deleteReservation: function (
      { commit, dispatch },
      { status, transactionRefNum }
    ) {
      const url = `transaction/reservation/delete/${status}/${transactionRefNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          commit("SET_TRANSACTION_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
          dispatch("resetLoading");
          return response;
        })
        .catch((error) => {
          commit("SET_TRANSACTION_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
          console.error("Error deleting reservation: ", error);
          dispatch("resetLoading");
          throw error;
        });
    },
    updateTransaction: function ({ dispatch }, payload) {
      const url = `transaction/update`;

      dispatch("triggerLoading", "form");

      return this.$axios
        .put(url, payload)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error("Error updating transaction: ", error);
          throw error;
        })
        .finally(() => {
          dispatch("resetLoading", "form");
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
