import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/play/:id',
    name: 'Play',
    component: () => import('@/views/Play.vue'),
    props: true,
  },
  {
    path: '/_play/:id',
    redirect: '/play/:id',
    component: () => import('@/views/_Play.vue'),
  },
  {
    path: '/test/',
    component: () => import(/* webpackChunkName: "about" */ '../views/test.vue'),
  },
  {
    path: '/_test/',
    component: () => import(/* webpackChunkName: "about" */ '../views/_test.vue'),
  },

  {
    path: '/login/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    props: true,
  },
  {
    path: '/loading/',
    name: 'login_logout_loading',
    component: () => import('@/views/LoginLogoutLoading.vue'),
    props: true,
  },
  {
    path: '/my_page/',
    name: 'MyPage',
    component: () => import('@/views/MyPage.vue'),
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
        path: 'test',
        component: () => import('@/views/upload/test.vue'),
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
  routes:routes,
})

//自分自身を呼び出した際にエラーをキャッチ
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
