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
    async login({ commit }, { user, loginRole }) {
      // Set Login Path for Backend
      let loginPath = "";

      let payload = {
        password: user.password,
      };

      if (loginRole === "ADMIN") {
        loginPath = "user/admin/login";
        payload.username = user.username;
      } else if (loginRole === "GUEST") {
        loginPath = "user/guest/login";
        payload.email = user.username;
      }

      try {
        const url = loginPath;

        let response = await this.$axios.post(url, payload);
        commit("SET_CURRENT_USER", response.data.results);
        commit("SET_LOGIN_STATUS", {
          message: response.data.message,
          status: "SUCCESS",
        });

        if (response.data.results.role !== "GUEST") {
          await this.$router.push({ name: "Dashboard" });
        } else {
          await this.$router.push({ name: "Guest Dashboard" });
        }
      } catch (error) {
        commit("SET_LOGIN_STATUS", {
          message: error.response.data.message,
          status: "ERROR",
        });
      }
    },

    async logout({ commit }, role) {
      let routeName = "";
      if (role !== "GUEST") {
        routeName = "Sign In";
      } else {
        routeName = "Guest Sign In";
      }

      try {
        const config = {
          headers: {
            Authorization: "Bearer " + this.$auth.token(),
          },
        };

        let url = "user/logout";

        await this.$axios.get(url, config);
        commit("SET_CURRENT_USER", null);
        await this.$router.push({ name: routeName });
      } catch (error) {
        commit("SET_CURRENT_USER", null);
        await this.$router.push({ name: routeName });
      }
    },

    async register({ commit }, data) {
      try {
        const url = "user/register";
        const loginUrl = "user/guest/login";
        let payload = {
          username: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          mobileNumber: data.mobileNumber,
        };

        let response = await this.$axios.post(url, payload);
        if (response.data.code === 200) {
          const loginPayload = {
            email: payload.username,
            password: payload.password,
          };
          let response = await this.$axios.post(loginUrl, loginPayload);
          if (response.data.code === 200) {
            commit("SET_CURRENT_USER", response.data.results);
            commit("SET_LOGIN_STATUS", {
              message: response.data.message,
              status: "SUCCESS",
            });
            await this.$router.push({ name: "Guest Dashboard" });
          }
        }
      } catch (error) {
        commit("SET_LOGIN_STATUS", {
          message: error.response.data.message,
          status: "ERROR",
        });
      }
    },

    clearUserData({ commit }) {
      commit("SET_CURRENT_USER", null);
    },
  },
};
