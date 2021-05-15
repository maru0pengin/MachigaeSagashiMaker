import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    twitterId: "",
    status: false
  },
  mutations: {
    onAuthStateChanged(state, user) {
      state.user = user; //firebaseが返したユーザー情報
    },
    onTwitterIDChanged(state, twitterId) {
      state.twitterId = twitterId;
    },
    onUserStatusChanged(state, status) {
      state.status = status; //ログインしてるかどうか true or false
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    },
    twitterId(state) {
      return state.twitterId;
    }
  },
  actions: {
  },
  modules: {
  }
})
