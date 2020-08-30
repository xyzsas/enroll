import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/enroll/:id',
    name: 'Enroll',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "enroll" */ '../views/Enroll.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
