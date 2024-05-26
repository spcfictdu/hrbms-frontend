import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const transaction = {
  namespaced: true,
  state: () => ({
    transactions: null,
    transaction: null,
  }),
  getters: {},
  mutations: {
    SET_TRANSACTIONS: (state, data) => (state.transactions = data),
    SET_TRANSACTION: (state, data) => (state.transaction = data),
  },
  actions: {
    fetchTransactions: function ({ commit }) {
      const url = `transaction`;
      return this.$axios
        .get(url)
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
    deleteReservation: function ({ _ }, { status, transactionRefNum }) {
      const url = `transaction/reservation/delete/${status}/${transactionRefNum}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          console.log(response.data.message);
          this.$router.replace({
            name: "Availability",
          });
        })
        .catch((error) => {
          console.error("Error deleting reservation: ", error);
        });
    },
    updateTransaction: function ({ dispatch }, payload) {
      const url = `transaction/update`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          console.log(response.data.message);
          if (payload.status === "CONFIRMED") {
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
  },
};
