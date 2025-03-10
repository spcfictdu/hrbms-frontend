import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const account = {
  namespaced: true,
  state: () => ({
    accountInfo: null,
    userInfo: null,
    loading: {
      password: false,
      update: false,
    },
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
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
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
    updateAccountPassword: function (_, data) {
      const url = `guest/account/change-password`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating password", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateAccountInfo: function (_, data) {
      const url = `guest/account/update-details`;
      return this.$axios
        .put(url, data)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating account details", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    removeUserInfo: function ({ commit }) {
      commit("SET_USER_INFO", null);
    },
  },
};
