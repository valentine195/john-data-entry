import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import jquery from 'jquery';

window.$ = window.jQuery = jquery;

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/all.css';

import VCalendar from 'v-calendar';
import Notifications from 'vue-notification'

Vue.use(VCalendar);
Vue.use(Notifications);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // Prevent blank screen in Electron builds
    this.$router.push('/')
  }
}).$mount('#app')
