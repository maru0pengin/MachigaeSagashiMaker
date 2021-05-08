<template>
  <div>
    {{ user.displayName }}<button @click="goToLogin">Twitterでログイン</button
    ><br />
  </div>
</template>

<script>
import Firebase from "./../firebase"
export default {
  data() {
    return {}
  },
  created: function() {
    Firebase.onAuth()
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
    userStatus: function(userStatus) {
      //console.log(userStatus)
      if (userStatus) this.$router.push("/")
      else console.log("ログインできていない")
    },
  },
  methods: {
    goToLogin() {
      this.$router.push({
        name: "login_loading",
        query: this.$route.query,
        params: {
          isLogin: true,
        },
      })
    },
  },
}
</script>

<style lang="sass" scoped></style>
