import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Meta from 'vue-meta'

Vue.use(VueRouter)
Vue.use(Meta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
})

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/play/:id',
    name: 'Play',
    component: () => import(/* webpackChunkName: "about" */ '../views/Play.vue'),
    props: true,
  },
  {
    path: '/login/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    props: true,
  },
  {
    path: '/loading/',
    name: 'login_logout_loading',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginLogoutLoading.vue'),
    props: true,
  },
  {
    path: '/my_page/',
    name: 'MyPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyPage.vue'),
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
        props: true,
      },
      {
        path: 'setInformations',
        name: 'setInformations',
        component: () => import('@/views/upload/setInformations.vue'),
        props: true,
      },
      {
        path: 'completed',
        name: 'completed',
        component: () => import('@/views/upload/completed.vue'),
        props: true,
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
