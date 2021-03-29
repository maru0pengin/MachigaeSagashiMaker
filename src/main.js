import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase/app'

Vue.config.productionTip = true


if (firebase.apps.length === 0) {
  firebase.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG))
  console.log("test")
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


