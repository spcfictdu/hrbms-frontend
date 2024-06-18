import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const authentication = {
  namespaced: true,
  state: {
    currentUser: null,
    loginStatus: {
      message: "",
      status: "", //SUCCESS, ERROR
    },
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
  },
  mutations: {
    SET_CURRENT_USER: (state, data) => (state.currentUser = data),
    SET_LOGIN_STATUS: (state, data) => (state.loginStatus = data),
  },
  actions: {
    async login({ commit }, data) {
      try {
        let url = "user/login";
        let payload = {
          username: data.username,
          password: data.password,
        };

        let response = await this.$axios.post(url, payload);
        commit("SET_CURRENT_USER", response.data.results);
        commit("SET_LOGIN_STATUS", {
          message: response.data.message,
          status: "SUCCESS",
        });

        this.$router.push({ name: "Dashboard" });
      } catch (error) {
        commit("SET_LOGIN_STATUS", {
          message: error.response.data.message,
          status: "ERROR",
        });
      }
    },

    async logout({ commit }) {
      try {
        const config = {
          headers: {
            Authorization: "Bearer " + this.$auth.token(),
          },
        };

        let url = "user/logout";

        await this.$axios.get(url, config);
        commit("SET_CURRENT_USER", null);
        this.$router.push({ name: "Sign In" });
      } catch (error) {
        commit("SET_CURRENT_USER", null);
        this.$router.push({ name: "Sign In" });
      }
    },
  },
};
