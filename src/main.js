import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/tailwind.css'
import '@/plugins/element'

import firebase from "firebase/app"
import "firebase/analytics"
import Firebase from "./firebase"
Firebase.init()
firebase.analytics()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
