import Vue from 'vue'
import App from './App.vue'
import router from './router'

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

import './utils/prototype';

import ErrorHandler from './utils/errors';
Vue.use(ErrorHandler);

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')