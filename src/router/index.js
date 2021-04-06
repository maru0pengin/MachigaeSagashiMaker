import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  // 問題アップロード画面
  {
    path: '/upload',
    component: () => import('@/views/upload/uploadLayout.vue'),
    children: [
      {
        path: '/upload',
        name: 'imageUpload',
        component: () => import('@/views/upload/imageUpload.vue'),
      },
      {
        path: 'trim',
        name: 'trim',
        component: () => import('@/views/upload/trim.vue'),
        props: true,
      },
      {
        path: 'setDifferences',
        name: 'setDifferences',
        component: () => import('@/views/upload/setDifferences.vue'),
      },
      {
        path: 'setInformations',
        name: 'setInformations',
        component: () => import('@/views/upload/setInformations.vue'),
      },
      {
        path: 'completed',
        name: 'completed',
        component: () => import('@/views/upload/completed.vue'),
      }
    ]
  },
  {
    path: '/SavePosition',
    name: 'SavePosition',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SavePosition.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
