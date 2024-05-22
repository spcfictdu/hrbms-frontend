import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"

import { authentication } from "./authentication/authentication";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication
  },
  plugins: [createPersistedState({
    paths: ['authentication.currentUser']
  })]
});
