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

const axiosInstance = axios.create({ baseURL: getBackend("deployed") });

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

// Reset or upon refresh session handling
window.addEventListener("beforeunload", (event) =>
  auth.handleTabTermination(event)
);
auth.handleTabRefresh();

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
