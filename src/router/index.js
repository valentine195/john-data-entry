import Vue from 'vue'
import VueRouter from 'vue-router'
import InvoiceInput from '../views/InvoiceInput.vue'
import InvoiceView from '../views/InvoiceView.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Invoice Input',
		component: InvoiceInput
	},
	{
		path: '/view',
		name: 'Invoice Viewer',
		component: InvoiceView
	}
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	mode: process.env.IS_ELECTRON ? 'hash' : 'history',
	routes
})

export default router