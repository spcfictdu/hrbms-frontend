import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const vouchers = {
  namespaced: true,
  state: () => ({
    vouchers: [],
    activeVoucher: null,
  }),
  getters: {
    getVoucher: (state) => (voucherCode) =>
      state.vouchers.find((v) => v.code === voucherCode),
  },
  mutations: {
    SET_VOUCHERS: (state, data) => (state.vouchers = data),
    SET_ACTIVE_VOUCHER: (state, data) => (state.activeVoucher = data),
  },
  actions: {
    fetchVouchers({ commit }) {
      const url = `voucher`;
      return this.$axios
        .get(url)
        .then((response) => {
          commit("SET_VOUCHERS", response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching vouchers: ", error);
        });
    },
  },
};
