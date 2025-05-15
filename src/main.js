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

const backendAPI = getBackend("local");

const axiosInstance = axios.create({ baseURL: `${backendAPI}/api` });

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

Vue.prototype.$axios = axiosInstance;
Vue.prototype.$auth = auth;
Vue.prototype.$apiPath = backendAPI;

Vuex.Store.prototype.$axios = axiosInstance;
Vuex.Store.prototype.$router = router;
Vuex.Store.prototype.$auth = auth;
Vuex.Store.prototype.$store = store;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
