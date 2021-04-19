import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'
import '@/assets/tailwind.css'

import '@/plugins/element'

require('dotenv').config();
Vue.config.productionTip = false
import firebase from "firebase/app"
if (firebase.apps.length === 0) {
  firebase.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG));
}

new Vue({
  router,
  store,
  VueMeta,
  render: h => h(App),
}).$mount('#app')
