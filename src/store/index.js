import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import { authentication } from "./authentication/authentication";
import { roomTypeEnum, roomNumberEnum, roomEnum, rateTypeEnum } from "./enums/rooms";
import { transaction } from "./transaction/transaction";
import { guest } from "./guest/guest";
import { availabilityCalendar } from "./calendar/availability-calendar";
import { roomPrice } from "./rooms/room-pricing";
import { rooms } from "./rooms/rooms";
import { roomCategories } from "./categories/room-categories";
import { amenities } from "./amenities/amenities";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    transaction,
    guest,
    availabilityCalendar,
    roomPrice,
    rooms,
    roomCategories,
    amenities,

    //Enums
    roomTypeEnum,
    roomNumberEnum,
    roomEnum,
    rateTypeEnum,
  },
  plugins: [
    createPersistedState({
      paths: ["authentication.currentUser"],
    }),
  ],
});
