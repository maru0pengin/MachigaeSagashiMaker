<template>
  <div class="min-w-screen flex justify-center my-16">
    <div
      class="flex flex-col max-w-md bg-white py-6 px-10 rounded-xl items-center shadow-lg"
    >
      {{ user.displayName }}
      <img v-bind:src="user.photoURL" class="w-16 h-16 rounded-full " />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
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
  mounted() {},
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

<style lang="sass" scoped>

.button_twitter
 background: #00acee
 @apply p-4 rounded-lg flex

li
  @apply py-1
</style>
