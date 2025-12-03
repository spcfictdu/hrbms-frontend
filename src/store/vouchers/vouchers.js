import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const vouchers = {
  namespaced: true,
  state: () => ({
    vouchers: [],
    loading: false,
    activeVoucher: null,
  }),
  getters: {
    getVoucher: (state) => (voucherCode) =>
      state.vouchers.find((v) => v.code === voucherCode),
    getVoucherByReferenceNumber: (state) => (referenceNumber) =>
      state.vouchers.find((v) => v.referenceNumber === referenceNumber),
  },
  mutations: {
    SET_VOUCHERS: (state, data) => {
      state.vouchers = data
    },
    SET_ACTIVE_VOUCHER: (state, data) => {
      state.activeVoucher = data
    },
    SET_LOADING: (state, data) => {
      state.loading = data
    },
    ADD_VOUCHER: (state, data) => state.vouchers.push(data),
    UPDATE_VOUCHER: (state, { referenceNumber, data }) => {
      const index = state.vouchers.findIndex(
        (v) => v.referenceNumber === referenceNumber,
      )
      if (index !== -1) {
        Vue.set(state.vouchers, index, { ...state.vouchers[index], ...data })
      }
    },
    DELETE_VOUCHER: (state, referenceNumber) => {
      state.vouchers = state.vouchers.filter(
        (v) => v.referenceNumber !== referenceNumber,
      )
    },
  },
  actions: {
    async fetchVouchers({ commit }) {
      const url = "voucher"

      commit("SET_LOADING", true)
      try {
        const { data } = await this.$axios.get(url)
        commit("SET_VOUCHERS", data.results)
        return data.results
      } catch (err) {
        console.error("Error fetching vouchers: ", err.response.data.message)
        commit("SET_VOUCHERS", [])
      } finally {
        commit("SET_LOADING", false)
      }
    },

    async createVoucher({ commit, dispatch }, data) {
      const url = "voucher/create"

      dispatch("alerts/requireAlertFn", 2, { root: true })
      commit("SET_LOADING", true)
      try {
        const response = await this.$axios.post(url, data)
        commit("ADD_VOUCHER", {
          ...response.data.results,
          expiresAt: `${data.expires_at} 00:00:00`,
        })
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        })
        return response.data.results
      } catch (err) {
        console.error("Error creating voucher: ", err.response.data.message)
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        })
      } finally {
        commit("SET_LOADING", false)
      }
    },

    async updateVoucher({ commit, dispatch }, { refNum, data }) {
      const url = `voucher/update/${refNum}`

      dispatch("alerts/requireAlertFn", 2, { root: true })
      commit("SET_LOADING", true)
      try {
        const response = await this.$axios.put(url, data)
        commit("UPDATE_VOUCHER", {
          referenceNumber: refNum,
          data: response.data.results,
        })
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        })
        return response.data.results
      } catch (err) {
        console.error("Error updating voucher: ", err.response.data.message)
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        })
      } finally {
        commit("SET_LOADING", false)
      }
    },

    async deleteVoucher({ commit, dispatch }, refNum) {
      const url = `voucher/delete/${refNum}`

      dispatch("alerts/requireAlertFn", 2, { root: true })
      commit("SET_LOADING", true)
      try {
        const response = await this.$axios.delete(url)
        commit("DELETE_VOUCHER", refNum)
        dispatch("alerts/triggerSuccess", response.data.message, {
          root: true,
        })
        return response.data.results
      } catch (err) {
        console.error("Error deleting voucher: ", err.response.data.message)
        dispatch("alerts/triggerError", err.response?.data?.message, {
          root: true,
        })
      } finally {
        commit("SET_LOADING", false)
      }
    },
  },
}
