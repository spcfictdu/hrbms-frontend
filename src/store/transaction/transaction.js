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
      status: "", //SUCCESS, ERROR
    },
  }),
  getters: {},
  mutations: {
    SET_TRANSACTIONS: (state, data) => (state.transactions = data),
    SET_TRANSACTION: (state, data) => (state.transaction = data),
    SET_TRANSACTION_STATUS: (state, data) => (state.transactionStatus = data),
    SET_PREVIOUS_TRANSACTIONS: (state, data) =>
      (state.previousTransactions = data),
  },
  actions: {
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
    createTransaction: function ({ _ }, payload) {
      const url = `transaction/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          if (response.data.results.status === "RESERVED") {
            this.$router.push({
              name: "Confirmation",
              params: {
                referenceNumber: response.data.results.referenceNumber,
              },
            });
          } else {
            this.$router.push({
              name: "CheckInOut",
              params: {
                referenceNumber: response.data.results.referenceNumber,
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error creating transaction: ", error);
        });
    },
    deleteReservation: function (
      { commit, state },
      { status, transactionRefNum }
    ) {
      const url = `transaction/reservation/delete/${status}/${transactionRefNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          this.$router.replace({
            name: "Transactions",
          });
          commit("SET_TRANSACTION_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
          });
        })
        .catch((error) => {
          console.error("Error deleting reservation: ", error);
          this.$router.push({
            name: "Transactions",
          });
          commit("SET_TRANSACTION_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
          });
        });
    },
    updateTransaction: function ({ dispatch }, payload) {
      const url = `transaction/update`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          console.log(response.data.message);
          if (payload.status === "RESERVED") {
            this.$router.push({
              name: "CheckInOut",
              params: { referenceNumber: payload.referenceNumber },
            });
          } else {
            dispatch("fetchTransaction", payload.referenceNumber);
          }
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
          console.log(response.data);
          commit("SET_PREVIOUS_TRANSACTIONS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching form transactions", error);
        });
    },
  },
};
