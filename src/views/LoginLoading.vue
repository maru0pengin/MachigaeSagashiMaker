<template>
  <div>
    <div class="h-screen" />
    <div class="background">
      <Loading v-bind:loading="true" />
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading"
import Firebase from "./../firebase"
import firebase from "firebase"

export default {
  name: "login_loading",
  data() {
    return {
      twitterId: "",
    }
  },
  components: {
    Loading,
  },
  props: {
    isLogin: { type: Boolean, default: false },
  },
  mounted: function() {
    if (this.isLogin) Firebase.login()
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
          })
        //ユーザー情報を取得できるまで待ち、取得できたら更新
        const unsubscribe = await firebase
          .firestore()
          .doc(`users/${this.user.uid}`)
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              firebase
                .firestore()
                .doc(`users/${this.user.uid}`)
                .update({
                  photoURL: this.user.photoURL,
                  displayName: this.user.displayName,
                  twitterId: this.twitterId,
                })
              unsubscribe()
            }
          })
      }
      this.$router.push("/")
    },
  },
}
</script>
<style lang="sass" scoped>
.background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-10
</style>
