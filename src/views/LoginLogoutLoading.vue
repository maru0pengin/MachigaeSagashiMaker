<template>
  <div>
    <div class="h-screen" />
    <div class="background">
      <Loading v-bind:loading="true" />
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import Firebase from './../firebase'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
  name: 'login_logout_loading',
  data() {
    return {
      twitterId: '',
      displayNmae: '',
      photoURL: '',
    }
  },
  components: {
    Loading,
  },
  props: {
    isLogin: { type: Boolean, default: false },
    isLogout: { type: Boolean, default: false },
  },
  mounted: function() {
    if (this.isLogin) Firebase.login()
    //ログアウトした感を出すために1秒待つ
    if (this.isLogout) {
      setTimeout(() => {
        Firebase.logout()
      }, 1000)
    }
    if (!this.isLogin && !this.isLogout) {
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    userStatus() {
      // ログインするとtrue
      return this.$store.getters.isSignedIn
    },
  },
  watch: {
    userStatus: async function(to) {
      if (to) {
        // TwitterIDを取得
        await firebase
          .auth()
          .getRedirectResult()
          .then((userCredential) => {
            this.twitterId = userCredential.additionalUserInfo.username
            this.displayName = userCredential.additionalUserInfo.profile.name
            this.photoURL =
              userCredential.additionalUserInfo.profile.profile_image_url
          })
        //ユーザー情報を取得できるまで待ち、取得できたらfirestoreを更新
        const unsubscribe = await firebase
          .firestore()
          .doc(`users/${this.user.uid}`)
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              firebase
                .firestore()
                .doc(`users/${this.user.uid}`)
                .update({
                  photoURL: this.photoURL,
                  displayName: this.displayName,
                  twitterId: this.twitterId,
                })
              unsubscribe()
            }
          })
        //Authのユーザー情報も更新(TwitterIDは更新していない)
        this.user.updateProfile({
          displayName: this.displayName,
          photoURL: this.photoURL,
        })
      }
      this.$router.push('/')
    },
  },
}
</script>
<style lang="sass" scoped>
.background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-30
</style>
