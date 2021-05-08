<template>
  <Loading v-bind:loading="loading" />
</template>

<script>
import Loading from "@/components/Loading"
import Firebase from "./../firebase"
export default {
  name: "login_loading",
  components: {
    Loading,
  },
  data() {
    return {
      loading: true,
    }
  },
  props: {
    isLogin: { type: Boolean, default: false },
  },
  mounted: function() {
    if (this.isLogin) Firebase.login()
  },
  computed: {
    userStatus() {
      // ログインするとtrue
      return this.$store.getters.isSignedIn
    },
  },
  watch: {
    userStatus: function() {
      this.$router.push("/")
    },
  },
}
</script>
