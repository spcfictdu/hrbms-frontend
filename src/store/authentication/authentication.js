import Vue from "vue";
import Vuex from "vuex";
import store from "..";

Vue.use(Vuex);

const whichAPI = (role) => `user/${role.toLowerCase()}/login`;
const whichUserKey = {
  ADMIN: "username",
  GUEST: "email",
};
const whichlogoutRoute = {
  ADMIN: "Sign In",
  GUEST: "Guest Sign In",
};

export const authentication = {
  namespaced: true,
  state: {
    currentUser: null,
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
  },
  mutations: {
    SET_CURRENT_USER: (state, data) => (state.currentUser = data),
    SET_LOGIN_STATUS: (state, data) => (state.loginStatus = data),
  },
  actions: {
    login: async function ({ commit }, { user, loginRole }) {
      const url = whichAPI(loginRole);

      const payload = {
        password: user.password,
        [whichUserKey[loginRole]]: user.username,
      };

      try {
        let response = await this.$axios.post(url, payload);
        commit("SET_CURRENT_USER", response.data.results);

        if (response.data.results.role !== "GUEST") {
          this.$router.push({ name: "Dashboard" });
        } else {
          store.dispatch("account/fetchAccountInfo");
          this.$router.push({ name: "Guest Dashboard" });
        }
      } catch (error) {
        this.$store.dispatch(
          "alerts/triggerError",
          error.response.data.message
        );
      }
    },
    logout: async function ({ commit }, role) {
      const url = "user/logout";

      try {
        const config = {
          headers: {
            Authorization: "Bearer " + this.$auth.token(),
          },
        };

        const response = await this.$axios.get(url, config);
        return response;
      } catch (error) {
        this.$store.dispatch(
          "alerts/triggerError",
          error.response.data.message
        );
      } finally {
        // Remove Persisted State
        commit("SET_CURRENT_USER", null);
        store.dispatch("account/removeUserInfo");

        // Back To Login
        await this.$router.push({ name: whichlogoutRoute[role] });
      }
    },
    register: async function ({ commit }, data) {
      const url = "user/register";
      const loginUrl = "user/guest/login";

      try {
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

        if (response.data.code === 201) {
          const loginPayload = {
            email: payload.email,
            password: payload.password,
          };

          let response = await this.$axios.post(loginUrl, loginPayload);

          if (response.data.code === 200) {
            store.dispatch("account/fetchAccountInfo");
            commit("SET_CURRENT_USER", response.data.results);

            if (store.state.publicRooms.temporaryData) {
              this.$router.push({
                name: "Guest Booking",
                query: store.state.publicRooms.temporaryData.query,
              });
            } else {
              this.$router.push({ name: "Guest Dashboard" });
            }
          }
        }
      } catch (error) {
        this.$store.dispatch(
          "alerts/triggerError",
          error.response.data.message
        );
      }
    },
    clearUserData({ commit }) {
      commit("SET_CURRENT_USER", null);
      store.dispatch("publicRooms/clearTempData");
    },
  },
};
