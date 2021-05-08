<template>
  <div>
    {{ user.displayName }}<button @click="doLogin">Signin</button><br />
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
    },
  },
  methods: {
    doLogin() {
      Firebase.login()
    },
  },
}
</script>

<style lang="sass" scoped></style>
