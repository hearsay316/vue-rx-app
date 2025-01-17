import "buefy/dist/buefy.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueRx from "vue-rx";
import Buefy from "buefy";
Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(VueRx);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
