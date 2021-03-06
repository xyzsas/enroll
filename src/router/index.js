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
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admun" */ '../views/Admin.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  window.Swal.close()
  next()
})

export default router
