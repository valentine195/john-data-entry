import Vue from 'vue'
import VueRouter from 'vue-router'
import InvoiceInput from '../views/InvoiceInput.vue'
import InvoiceView from '../views/InvoiceView.vue'

Vue.use(VueRouter)

  const routes = [
  {
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
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
