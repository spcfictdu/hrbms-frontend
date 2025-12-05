import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { functions } from "@/utils/functions";

export const transaction = {
  namespaced: true,
  state: () => ({
    transactions: null,
    transaction: null,
    payment: null,
    previousTransactions: null,
    loading: {
      flights: false,
      transactions: false,
      transaction: false,
      payment: false,
      dialog: false,
      form: false,
      flightForm: false,
      cancel: false,
      header: false,
    },
    dialog: {
      confirmation: false,
      warning: false,
    },
    flights: [],
  }),
  getters: {
    getLoading: (state) => (name) => state.loading[name],
  },
  mutations: {
    SET_PAYMENT: (state, data) => (state.payment = data),
    SET_TRANSACTIONS: (state, data) => (state.transactions = data),
    SET_TRANSACTION: (state, data) => (state.transaction = data),
    SET_DIALOG: (state, { key, value }) => (state.dialog[key] = value),
    SET_PREVIOUS_TRANSACTIONS: (state, data) =>
      (state.previousTransactions = data),
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
    ADD_TRANSACTION: (state, transaction) =>
      state.transactions.data.push(transaction),
    SET_FLIGHTS: (state, flights) => (state.flights = flights),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    async fetchPayment({ commit }, payload) {
      const url = "transaction/payment/show";

      commit("SET_LOADING", { key: "payment", value: true });
      try {
        const { data } = await this.$axios.get(url, { params: payload });
        commit("SET_PAYMENT", data);
        return data;
      } catch (err) {
        commit("SET_PAYMENT", null);
        console.error("Error fetching payment: ", err);
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "payment", value: false });
      }
    },
    async fetchFlights({ commit }, transactionReferenceNumber) {
      const url = `transaction/${transactionReferenceNumber}/flight`;

      commit("SET_LOADING", { key: "flights", value: true });
      commit("SET_FLIGHTS", []);
      try {
        const { data } = await this.$axios.get(url);
        commit("SET_FLIGHTS", data.results);
        return data.results;
      } catch (err) {
        commit("SET_FLIGHTS", []);
        console.error(err.response.data.message);
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "flights", value: false });
      }
    },
    async createFlight(
      { commit, dispatch },
      { transactionReferenceNumber, payload },
    ) {
      const url = `transaction/${transactionReferenceNumber}/flight`;

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "flightForm", value: true });
      try {
        const response = await this.$axios.post(url, payload);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        dispatch("fetchFlights", transactionReferenceNumber);
        return response;
      } catch (err) {
        console.error("Error creating flight: ", err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "flightForm", value: false });
      }
    },
    async updateFlight(
      { commit, dispatch },
      { transactionReferenceNumber, payload },
    ) {
      const url = "transaction/flight/update";

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "flightForm", value: true });

      try {
        const response = await this.$axios.put(url, payload);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        dispatch("fetchFlights", transactionReferenceNumber);
        return response;
      } catch (err) {
        console.error("Error updating flight: ", err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "flightForm", value: false });
      }
    },
    async deleteFlight(
      { commit, dispatch },
      { transactionReferenceNumber, payload },
    ) {
      const url = "transaction/flight/delete";

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "dialog", value: true });
      try {
        const response = await this.$axios.delete(url, { data: payload });
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        dispatch("fetchFlights", transactionReferenceNumber);
        return response;
      } catch (err) {
        console.error("Error deleting flight: ", err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
        commit("SET_DIALOG", { key: "confirmation", value: false });
      }
    },
    async fetchTransactions({ commit }, queryParams = {}) {
      const url = `transaction`;
      const queryUrl = functions.query(url, queryParams);

      commit("SET_LOADING", { key: "transactions", value: true });
      try {
        const { data } = await this.$axios.get(queryUrl);
        commit("SET_TRANSACTIONS", data.results);
        return data;
      } catch (err) {
        commit("SET_TRANSACTIONS", null);
        console.error("Error fetching transactions: ", err);
      } finally {
        commit("SET_LOADING", { key: "transactions", value: false });
      }
    },
    async fetchTransaction({ commit }, referenceNumber) {
      // Reset to null state every fetch transaction
      commit("SET_TRANSACTION", null);

      // Get the transaction
      const url = `transaction/show/${referenceNumber}`;

      commit("SET_LOADING", { key: "transaction", value: true });
      try {
        const { data } = await this.$axios.get(url);
        const transaction = data.results.bookingHistory;
        commit("SET_TRANSACTION", transaction);
        return transaction;
      } catch (err) {
        commit("SET_TRANSACTION", null);
        console.error(
          "Error fetching transaction: ",
          err.response.data.message,
        );
      } finally {
        commit("SET_LOADING", { key: "transaction", value: false });
      }
    },
    async createTransaction({ commit, dispatch }, payload) {
      const url = `transaction/create`;

      commit("SET_LOADING", { key: "dialog", value: true });
      commit("SET_LOADING", { key: "form", value: true });
      try {
        const response = await this.$axios.post(url, payload);
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        });
        return response;
      } catch (err) {
        console.error("Error creating transaction:", err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "dialog", value: false });
        commit("SET_LOADING", { key: "form", value: false });
      }
    },
    async deleteReservation(
      { commit, dispatch },
      { status, transactionRefNum },
    ) {
      const url = `transaction/reservation/delete/${status}/${transactionRefNum}`;

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      commit("SET_LOADING", { key: "cancel", value: true });
      try {
        const { data } = await this.$axios.delete(url);
        dispatch("alerts/triggerSuccess", data.message, {
          root: true,
        });
        return data;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        return err.response.data;
      } finally {
        commit("SET_LOADING", { key: "cancel", value: false });
      }
    },
    updateTransaction: function ({ commit }, payload) {
      const url = `transaction/update`;

      commit("SET_LOADING", { key: "dialog", value: true });
      commit("SET_LOADING", { key: "form", value: true });
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
            error.response.data.message,
          );
          throw error;
        })
        .finally(() => {
          commit("SET_LOADING", { key: "dialog", value: false });
          commit("SET_LOADING", { key: "form", value: false });
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
    async updateFolio({ dispatch }, payload) {
      const url = "transaction/folio/update";

      dispatch("alerts/requireAlertFn", 2, {
        root: true,
      });
      try {
        const { data } = await this.$axios.put(url, payload);
        dispatch("alerts/triggerSuccess", data.message, {
          root: true,
        });
        return data;
      } catch (err) {
        dispatch("alerts/triggerError", err.response.data.message, {
          root: true,
        });
        console.error(err);
        throw err;
      }
    },
  },
};
