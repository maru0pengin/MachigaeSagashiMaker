<template>
  <div>
    <nav
      class="w-full z-10 flex bg-blue-300 lg:px-8 px-4 py-4 text-white items-center relative justify-between md:justify-start"
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
          @click="isMenuOpen = !isMenuOpen"
          class="ml-auto focus:outline-none"
        >
          <img src="@/assets/menu.png" class="w-8 h-8" />
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
    <transition name="menu">
      <div
        v-show="isMenuOpen && userStatus"
        class="bg-blue-300 w-28 h-auto absolute right-0 p-2 rounded-b-lg font-bold text-white"
      >
        <button
          @click="doLogout"
          class="p-2 hover:text-blue-100 focus:outline-none ml-auto font-bold"
        >
          ログアウト
        </button>
        <button
          @click="gotoMyPage"
          class="p-2 hover:text-blue-100 focus:outline-none ml-auto font-bold"
        >
          マイページ
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import Firebase from "./../firebase"
export default {
  created: function() {
    Firebase.onAuth()
  },
  data() {
    return {
      isMenuOpen: false,
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
    $route: function() {
      this.isMenuOpen = false
    },
  },
  methods: {
    gotoContact() {
      window.open(`https://forms.gle/1uCV8gduy8PZu4jE9`)
    },
    // ログアウト処理
    doLogout() {
      Firebase.logout()
      this.$router.push({
        name: "Home",
        query: this.$route.query,
      })
    },
    gotoMyPage() {
      this.$router.push({
        name: "MyPage",
        query: this.$route.query,
      })
    },
  },
}
</script>

<style lang="sass" scoped>
.menu-enter-active, .menu-leave-active
  transition: all .5s ease

.menu-enter, .menu-leave-to
  transform: translateY(-80px)
</style>
