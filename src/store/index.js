import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"

import { authentication } from "./authentication/authentication";
import { roomTypeEnum, roomNumberEnum, roomEnum } from "./enums/rooms";
import { transaction } from "./transaction/transaction";
import { guest } from "./guest/guest";
import { availabilityCalendar } from "./calendar/availability-calendar";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    transaction,
    guest,
    availabilityCalendar,

    //Enums
    roomTypeEnum,
    roomNumberEnum,
    roomEnum,
  },
  plugins: [createPersistedState({
    paths: ['authentication.currentUser']
  })]
});
