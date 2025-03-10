import Vue from "vue";
import Vuex from "vuex";
import store from "..";

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
      const loginPath = {
        ADMIN: "user/admin/login",
        GUEST: "user/guest/login",
      };
      const userKey = {
        ADMIN: "username",
        GUEST: "email",
      };

      const payload = {
        password: user.password,
        [userKey[loginRole]]: user.username,
      };

      try {
        const url = loginPath[loginRole];

        let response = await this.$axios.post(url, payload);
        commit("SET_CURRENT_USER", response.data.results);
        commit("SET_LOGIN_STATUS", {
          message: response.data.message,
          status: "SUCCESS",
        });

        if (response.data.results.role !== "GUEST") {
          await this.$router.push({ name: "Dashboard" });
        } else {
          store.dispatch("account/fetchAccountInfo");
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
      const routeNames = {
        ADMIN: "Sign In",
        GUEST: "Guest Sign In",
      };

      try {
        const config = {
          headers: {
            Authorization: "Bearer " + this.$auth.token(),
          },
        };

        const url = "user/logout";

        await this.$axios.get(url, config);
        return response;
      } catch (error) {
        console.log("Error executing logout", error);
      } finally {
        // Remove Persisted State
        commit("SET_CURRENT_USER", null);
        store.dispatch("account/removeUserInfo");

        // Back To Login
        await this.$router.push({ name: routeNames[role] });
      }
    },

    async register({ commit }, data) {
      try {
        const url = "user/register";
        const loginUrl = "user/guest/login";
        let payload = {
          password: data.password,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          mobileNumber: data.mobileNumber,
        };

        let response = await this.$axios.post(url, payload);

        if (response.data.code === 200) {
          const loginPayload = {
            email: payload.email,
            password: payload.password,
          };

          let response = await this.$axios.post(loginUrl, loginPayload);

          if (response.data.code === 200) {
            store.dispatch("account/fetchAccountInfo");
            commit("SET_CURRENT_USER", response.data.results);
            commit("SET_LOGIN_STATUS", {
              message: response.data.message,
              status: "SUCCESS",
            });

            if (store.state.publicRooms.temporaryData) {
              await this.$router.push({
                name: "Guest Booking",
                query: store.state.publicRooms.temporaryData.query,
              });
            } else {
              await this.$router.push({ name: "Guest Dashboard" });
            }
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
      store.dispatch("publicRooms/clearTempData");
    },
  },
};
