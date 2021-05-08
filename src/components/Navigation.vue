<template>
  <nav
    class="w-full flex bg-blue-300 lg:px-8 px-4 py-4 text-white items-center relative justify-between md:justify-start"
  >
    <div class="tracking-tighter mx-2 md:w-96">
      <router-link to="/" class="text-xl lg:text-2xl">
        Machigae Sagashi
      </router-link>
    </div>

    <div class="text-white flex  top-full w-full">
      <div class="">
        <div class="flex mx-auto">
          <router-link
            to="/upload"
            class="font-bold px-4 py-2 hover:text-blue-100"
          >
            問題投稿
          </router-link>
          <button
            @click="gotoContact"
            class="font-bold px-4 py-2 hover:text-blue-100 focus:outline-none"
          >
            お問い合わせ
          </button>
        </div>
      </div>
      <button
        v-if="userStatus"
        @click="doLogout"
        class="font-bold px-4 py-2 hover:text-blue-100 focus:outline-none ml-auto"
      >
        ログアウト
      </button>
      <router-link
        v-else
        to="/login"
        class="font-bold px-4 py-2 hover:text-blue-100 ml-auto"
      >
        ログイン
      </router-link>
    </div>
  </nav>
</template>

<script>
import Firebase from "./../firebase"
export default {
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
  methods: {
    gotoContact() {
      window.open(`https://forms.gle/1uCV8gduy8PZu4jE9`)
    },
    // ログアウト処理
    doLogout() {
      Firebase.logout()
    },
  },
}
</script>
