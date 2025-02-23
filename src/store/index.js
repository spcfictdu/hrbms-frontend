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

// Enums
import {
  roomTypeEnum,
  roomNumberEnum,
  roomEnum,
  rateTypeEnum,
  availableRoomNumbersEnum,
} from "./enums/rooms";

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

    //Enums
    roomTypeEnum,
    roomNumberEnum,
    roomEnum,
    rateTypeEnum,
    availableRoomNumbersEnum,
  },
  plugins: [
    createPersistedState({
      paths: [
        "authentication.currentUser",
        "account.userInfo",
        "publicRooms.temporaryData",
      ],
    }),
  ],
});
