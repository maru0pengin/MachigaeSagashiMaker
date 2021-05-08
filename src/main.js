import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/tailwind.css'
import firebase from "firebase/app"
import '@/plugins/element'

import Firebase from "./firebase";
Firebase.init();
firebase.analytics()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
