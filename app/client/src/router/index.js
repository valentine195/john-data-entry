import Vue from 'vue'
import VueRouter from 'vue-router'
import InvoiceInput from '../views/InvoiceInput.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Invoice Input',
    component: InvoiceInput
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
