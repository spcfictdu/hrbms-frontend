import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import { authentication } from "./authentication/authentication";
import { transaction } from "./transaction/transaction";
import { guest } from "./guest/guest";
import { availabilityCalendar } from "./calendar/availability-calendar";
import { roomRates } from "./categories/room-rates";
import { rooms } from "./rooms/rooms";
import { roomCategories } from "./categories/room-categories";
import { amenities } from "./amenities/amenities";
import { occupied } from "./occupied/occupied";
import { publicRooms } from "./public/public-rooms";
import { account } from "@/store/account/account";
import { alerts } from "@/store/alerts/alerts";

// Enums
import {
  roomTypeEnum,
  roomNumberEnum,
  roomEnum,
  rateTypeEnum,
  availableRoomNumbersEnum,
} from "./enums/rooms";
import { addonsEnum } from "./enums/addons";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    transaction,
    guest,
    availabilityCalendar,
    roomRates,
    rooms,
    roomCategories,
    amenities,
    occupied,
    publicRooms,
    account,

    // Enums
    roomTypeEnum,
    roomNumberEnum,
    roomEnum,
    rateTypeEnum,
    availableRoomNumbersEnum,
    addonsEnum,

    // Alerts
    alerts,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      paths: [
        "authentication.currentUser",
        "account.userInfo",
        "publicRooms.temporaryData",
      ],
    }),
  ],
});
