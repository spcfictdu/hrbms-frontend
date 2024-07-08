import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const account = {
  namespaced: true,
  state: () => ({
    accountInfo: null,
    userInfo: null,
    accountStatus: {
      message: "",
      status: "", //SUCCESS, ERROR
      type: "",
    },
    passwordDialog: false,
  }),
  getters: {
    accountHolder: (state) => {
      return state.accountInfo ? state.accountInfo.accountInfo : null;
    },
  },
  mutations: {
    SET_ACCOUNT_INFO: (state, data) => (state.accountInfo = data),
    SET_USER_INFO: (state, data) => (state.userInfo = data),
    SET_ACCOUNT_STATUS: (state, data) => {
      state.accountStatus = data;
      let interval = setInterval(() => {
        state.accountStatus = {
          message: "",
          status: "",
        };
        clearInterval(interval);
      }, 3000);
    },
    SET_PASSWORD_DIALOG: (state, data) => (state.passwordDialog = data),
  },
  actions: {
    triggerPasswordDialog: function ({ commit }, value) {
      commit("SET_PASSWORD_DIALOG", value);
    },
    fetchAccountInfo: function ({ commit }) {
      const url = `guest/account`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_ACCOUNT_INFO", response.data.results);
          commit("SET_USER_INFO", response.data.results.accountInfo);
        })
        .catch((error) => {
          console.error("Error fetching account information", error);
        });
    },
    updateAccountPassword: function ({ commit }, data) {
      const url = `guest/account/change-password`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          commit("SET_PASSWORD_DIALOG", false);
          commit("SET_ACCOUNT_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
            type: "PASSWORD",
          });
        })
        .catch((error) => {
          console.error("Error updating password", error);
          commit("SET_PASSWORD_DIALOG", true);
          commit("SET_ACCOUNT_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
            type: "PASSWORD",
          });
        });
    },
    updateAccountInfo: function ({ commit }, data) {
      const url = `guest/account/update-details`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          this.$router.replace({ name: "Guest Account Details" });
          commit("SET_ACCOUNT_STATUS", {
            message: response.data.message,
            status: "SUCCESS",
            type: "DETAILS",
          });
        })
        .catch((error) => {
          console.error("Error updating account details", error);
          commit("SET_ACCOUNT_STATUS", {
            message: error.response.data.message,
            status: "ERROR",
            type: "DETAILS",
          });
        });
    },
    removeUserInfo: function ({ commit }) {
      commit("SET_USER_INFO", null);
    }
  },
};
