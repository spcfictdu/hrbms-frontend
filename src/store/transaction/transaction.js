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
    meta: {
      title: "", // Transaction Type
      loading: false,
    },
  }),
  getters: {},
  mutations: {
    SET_TRANSACTIONS: (state, data) => (state.transactions = data),
    SET_TRANSACTION: (state, data) => (state.transaction = data),
    SET_TRANSACTION_STATUS: (state, data) => (state.transactionStatus = data),
    SET_PREVIOUS_TRANSACTIONS: (state, data) =>
      (state.previousTransactions = data),
    SET_META: (state, data) => (state.meta = data),
  },
  actions: {
    triggerLoading: function ({ commit }, data) {
      // Data is an Object
      commit("SET_META", data);
    },
    resetLoading: function ({ commit }) {
      commit("SET_META", {
        title: "",
        loading: false,
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
    createTransaction: function ({ dispatch }, payload) {
      const url = `transaction/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          dispatch("resetLoading");
          return response;
        })
        .catch((error) => {
          console.error("Error creating transaction: ", error);
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
          console.error("Error deleting reservation: ", error);
          commit("SET_TRANSACTION_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
          throw error;
        });
    },
    updateTransaction: function ({ dispatch }, payload) {
      const url = `transaction/update`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          dispatch("resetLoading");
          return response;
        })
        .catch((error) => {
          console.error("Error updating transaction: ", error);
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
