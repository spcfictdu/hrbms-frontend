import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"

import { authentication } from "./authentication/authentication";
import { roomTypeEnum, roomNumberEnum, roomEnum } from "./enums/rooms";
import { transaction } from "./transaction/transaction";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    transaction,

    //Enums
    roomTypeEnum,
    roomNumberEnum,
    roomEnum,
  },
  plugins: [createPersistedState({
    paths: ['authentication.currentUser']
  })]
});
