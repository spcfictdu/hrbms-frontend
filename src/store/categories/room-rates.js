import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const roomRates = {
  namespaced: true,
  state: () => ({
    loading: {
      dialog: false,
    },
  }),
  getter: {},
  mutations: {
    SET_LOADING: (state, { key, value }) => (state.loading[key] = value),
  },
  actions: {
    setLoading: function ({ commit }, { key, value }) {
      commit("SET_LOADING", { key, value });
    },
    createSpecialRoomRate: function (_, payload) {
      const url = `room-type/rate/special/create`;
      return this.$axios
        .post(url, payload)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error creating special rate: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    deleteSpecialRoomRate: function (_, roomTypeRateReferenceNumber) {
      const url = `room-type/rate/special/archive/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .delete(url)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error deleting special rate: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateRegularRoomRate: function (
      _,
      { roomTypeRateReferenceNumber, payload }
    ) {
      const url = `room-type/rate/regular/update/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating regular room rate: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
    updateSpecialRoomRate: function (
      _,
      { roomTypeRateReferenceNumber, payload }
    ) {
      const url = `room-type/rate/special/update/${roomTypeRateReferenceNumber}`;
      return this.$axios
        .put(url, payload)
        .then((response) => {
          this.$store.dispatch("alerts/triggerSuccess", response.data.message);
        })
        .catch((error) => {
          console.error("Error updating special room rate: ", error);
          this.$store.dispatch(
            "alerts/triggerError",
            error.response.data.message
          );
        });
    },
  },
};
