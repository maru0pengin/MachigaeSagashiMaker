<template>
  <div class="min-w-screen flex justify-center my-16">
    <div
      class="flex flex-col max-w-md bg-white py-6 px-10 rounded-xl items-center shadow-lg"
    >
      ボタンをクリックすると<br />Twitterのログイン画面へ遷移します。
      <button @click="goToLogin" class="button_twitter m-4 focus:outline-none">
        <img src="@/assets/Twitter_white.png" class="w-5 h-5" />
        <p class="text-white pl-2">Twitterでログイン</p>
      </button>
      <hr width="400" />
      <div class="my-2 text-sm">
        本サイトは作品を投稿した方の情報を保持するためにTwitterアカウントの連携を必要としています。
        <div class="text-xs my-2 text-left">
          <li>連携許可をログイン以外の目的で使用することはありません。</li>
          <li>あなたのアカウントから勝手にツイートすることはありません。</li>
          <li>DMなどを勝手に送信することはありません。</li>
        </div>
      </div>
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

<style lang="sass" scoped>

.button_twitter
 background: #00acee
 @apply p-4 rounded-lg flex

li
  @apply py-1
</style>
