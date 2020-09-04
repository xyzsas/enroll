import Vue from 'vue'
import VueRouter from 'vue-router'
import Enroll from '@/views/Enroll.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/enroll/:id',
    name: 'Enroll',
    component: Enroll
  }
]

const router = new VueRouter({
  routes
})

export default router
