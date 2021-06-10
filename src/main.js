import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as cv from 'opencv.js'
import '@/assets/tailwind.css'
import '@/plugins/element'

import firebase from "firebase/app"
import "firebase/analytics"
import Firebase from "@/firebase"
import Rollbar from 'rollbar' // クライアント側で起きたエラーを収集してSlackに通知を飛ばす

Firebase.init()
firebase.analytics()

Vue.prototype.$cv = cv
Vue.config.productionTip = true//開発中は trueにする
let cnt = 0
let tim = setInterval(() => {
  cnt++
  try {
    cv.getBuildInformation()
    clearInterval(tim)
    //console.log(cnt, 'INFO\n', info)
    // Now start Vue
    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  }
  catch(err) {
    //console.log('try again', cnt)
    if (cnt > 100) clearInterval(tim)
  }
}, 25)

if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$rollbar = new Rollbar({
    accessToken: process.env.VUE_APP_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.VUE_APP_ROLLBAR_ENV
    }
  })
  Vue.config.errorHandler = (err, vm) => {
    vm.$rollbar.error(err)
    throw err // rethrow
  }
} else {
  Vue.prototype.$rollbar = console
}
