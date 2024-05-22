import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios"
import Vuex from 'vuex';
import { auth } from "./utils/auth";

Vue.config.productionTip = false;

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api' // For localhost
})


if (auth.token()) {
  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + auth.token();
  axiosInstance.defaults.headers.common['Accept'] = 'application/json';
}

Vue.prototype.$axios = axiosInstance
Vue.prototype.$auth = auth

Vuex.Store.prototype.$axios = axiosInstance;
Vuex.Store.prototype.$router = router;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
