import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"

import { authentication } from "./authentication/authentication";
import { roomTypeEnum, roomNumberEnum } from "./enums/rooms";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    roomTypeEnum,
    roomNumberEnum,
  },
  plugins: [createPersistedState({
    paths: ['authentication.currentUser']
  })]
});
