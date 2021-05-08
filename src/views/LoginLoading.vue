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
export default {
  name: "login_loading",
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
<style lang="sass" scoped>
.background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-10
</style>
