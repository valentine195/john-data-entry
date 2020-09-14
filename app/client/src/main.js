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

String.prototype.toCamelCase = function (str) {
	if (!str) str = this;
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
		if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
}

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