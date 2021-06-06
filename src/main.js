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

console.log(process.env.NODE_ENV)
import Rollbar from 'rollbar' // クライアント側で起きたエラーを収集してSlackに通知を飛ばす

if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$rollbar = new Rollbar({
    // accessToken: process.env.VUE_APP_ROLLBAR_ACCESS_TOKEN,
    // captureUncaught: true,
    // captureUnhandledRejections: true,
    // payload: {
    //   environment: process.env.VUE_APP_ROLLBAR_ENV
    // }
    accessToken: "f7d57fa9ab424093bb40775b5c4a0b1e",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "production"
    }
  })

  Vue.config.errorHandler = (err, vm) => {
    vm.$rollbar.error(err)
    throw err // rethrow
  }
} else {
  Vue.prototype.$rollbar = console
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
