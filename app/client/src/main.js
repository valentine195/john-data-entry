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

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
