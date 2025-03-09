import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import Vuex from "vuex";
import { auth } from "./utils/auth";
import getBackend from "./utils/urls";

Vue.config.productionTip = false;

const axiosInstance = axios.create({ baseURL: getBackend("local") });

if (auth.token()) {
  axiosInstance.defaults.headers.common["Authorization"] =
    "Bearer " + auth.token();
  axiosInstance.defaults.headers.common["Accept"] = "application/json";
}

axiosInstance.interceptors.request.use((config) => {
  if (auth.token()) {
    config.headers.Authorization = `Bearer ${auth.token()}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (store.state.alerts.requireAlert.length > 0) {
      store.dispatch("alerts/triggerSuccess", response.data.message);
    }
    return response;
  },
  (error) => {
    if (store.state.alerts.requireAlert.length > 0) {
      store.dispatch("alerts/triggerError", error.response.data.message);
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = axiosInstance;
Vue.prototype.$auth = auth;
Vue.prototype.$apiPath = "http://192.168.31.231";

Vuex.Store.prototype.$axios = axiosInstance;
Vuex.Store.prototype.$router = router;
Vuex.Store.prototype.$auth = auth;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
