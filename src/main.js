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
