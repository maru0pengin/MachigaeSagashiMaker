<template>
  <div>
    <nav
      class="w-full h-20 z-20 flex bg-blue-300 lg:px-8 px-4 py-2 text-white items-center relative justify-between md:justify-start"
    >
      <div class="tracking-tighter mx-2 md:w-60">
        <router-link to="/" class="text-xl lg:text-2xl">
          <img src="@/assets/logo.png" class="w-56" />
        </router-link>
      </div>

      <div class="text-white flex top-full w-full">
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

        <div
          v-if="userStatus"
          v-click-outside="hide"
          @click="toggle"
          class="ml-auto my-auto"
        >
          <img src="@/assets/menu.png" class="w-8 h-8" />
        </div>

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
        class="bg-blue-300 w-32 h-auto absolute right-0 p-2 rounded-b-lg font-bold text-white text-lg z-10"
      >
        <button
          @click="gotoLogout"
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
import Firebase from './../firebase'
import ClickOutside from 'vue-click-outside'

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
    gotoLogout() {
      this.$router.push({
        name: 'login_logout_loading',
        query: this.$route.query,
        params: {
          isLogout: true,
        },
      })
    },
    gotoMyPage() {
      if (this.$route.path !== '/my_page')
        this.$router.push({
          name: 'MyPage',
          query: this.$route.query,
        })
    },
    toggle() {
      this.isMenuOpen = !this.isMenuOpen
    },
    hide() {
      this.isMenuOpen = false
    },
  },
  directives: {
    ClickOutside,
  },
}
</script>

<style lang="sass" scoped>
.menu-enter-active, .menu-leave-active
  transition: all .5s ease

.menu-enter, .menu-leave-to
  transform: translateY(-100px)
</style>
