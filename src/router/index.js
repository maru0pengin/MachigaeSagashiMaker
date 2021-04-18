import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' }
  },
  {
    path: '/play/:id',
    name: 'Play',
    component: () => import(/* webpackChunkName: "about" */ '../views/Play.vue'),
    meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' },
    props: true,
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
        meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' },
      },
      {
        path: 'trim',
        name: 'trim',
        component: () => import('@/views/upload/trim.vue'),
        meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' },
        props: true,
      },
      {
        path: 'setDifferences',
        name: 'setDifferences',
        component: () => import('@/views/upload/setDifferences.vue'),
        meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' },
        props: true,
      },
      {
        path: 'setInformations',
        name: 'setInformations',
        component: () => import('@/views/upload/setInformations.vue'),
        meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' },
        props: true,
      },
      {
        path: 'completed',
        name: 'completed',
        component: () => import('@/views/upload/completed.vue'),
        meta: { title: 'Machigae Sagashi', desc: '間違え探しゲームのプレイや、ゲームの投稿ができるWebサイトです。あなたのオリジナルな間違え探しゲームを投稿しましょう!' },
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
