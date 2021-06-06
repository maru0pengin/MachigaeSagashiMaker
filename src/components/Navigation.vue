<template>
  <div>
    <nav
      class="w-full z-20 h-[65px] md:h-[80px] flex items-center bg-blue px-4 text-white relative justify-between md:justify-start"
    >
      <div class="tracking-tighter md:w-60">
        <router-link to="/">
          <img src="@/assets/logo_small.png" class="w-64" />
        </router-link>
      </div>

      <div
        class="text-white flex items-center top-full w-full text-sm lg:text-lg"
      >
        <div>
          <div class="flex mx-auto">
            <router-link
              to="/upload"
              class="flex items-center font-bold px-2 lg:px-4 hover:text-blue-100"
            >
              <div v-if="width < 770" class="w-18 pt-1 pl-4">
                <img src="@/assets/create.svg" class="w-8 mx-auto" />
                <div class="text-[10px]">つくる</div>
              </div>

              <div v-else class="flex flex-row items-center">
                <img src="@/assets/create.svg" class="w-8 mx-4" />
                <p class="text-lg">まちがいさがしをつくる</p>
              </div>
            </router-link>
            <button
              @click="gotoContact"
              class="flex items-center font-bold px-4 hover:text-blue-100 focus:outline-none"
            >
              <div v-if="width < 770" class="w-18 pt-1">
                <img src="@/assets/contact.svg" class="w-8 mx-auto" />
                <div class="text-[10px]">お問い合わせ</div>
              </div>

              <div v-else class="flex flex-row items-center">
                <img src="@/assets/contact.svg" class="w-8 mx-4" />
                <p class="text-lg">お問い合わせ</p>
              </div>
            </button>
          </div>
        </div>
        <router-link
          to="/login"
          v-if="!userStatus"
          class="flex font-bold hover:text-blue-100 ml-auto "
        >
          <div v-if="width < 770" class="w-10 pt-1 ">
            <img src="@/assets/login.svg" class="w-8" />
            <div class="text-[10px]">ログイン</div>
          </div>

          <div v-else class="flex flex-row pr-4 items-center">
            <img src="@/assets/login.svg" class="md:w-8 md:mx-4" />
            <p class="md:text-lg">ログイン</p>
          </div>
        </router-link>

        <div v-else class="py-6 px-4"></div>
      </div>
    </nav>
    <div v-show="userStatus" v-click-outside="hide">
      <div
        @click="toggle"
        class="flex items-center z-20 py-4 px-6 text-white font-bold  ml-auto my-auto absolute -top-2 md:top-2 right-0"
      >
        <div v-if="width < 770" class="w-10 pt-[0.15rem] cursor-pointer">
          <img src="@/assets/menu.png" class="w-[2.1rem] mx-auto" />
          <div class="text-[10px]">メニュー</div>
        </div>

        <div v-else class="flex flex-row items-center cursor-pointer">
          <img src="@/assets/menu.png" class="w-8 mx-2" />
          <p class="text-lg">メニュー</p>
        </div>
      </div>
      <transition name="menu">
        <div
          v-show="isMenuOpen && userStatus"
          class="bg-blue mx-auto px-4 pb-4 h-auto absolute right-0 top-16 p-2 rounded-b-lg font-bold text-white z-10"
        >
          <button
            @click="gotoLogout"
            class="mx-auto p-2 flex items-center mt-2 hover:text-blue-100 focus:outline-none ml-auto font-bold"
          >
            <img src="@/assets/logout.svg" class="w-6 mr-4" />
            ログアウト
          </button>
          <button
            @click="gotoMyPage"
            class="mx-auto p-2 flex items-center hover:text-blue-100 focus:outline-none ml-auto font-bold"
          >
            <img src="@/assets/mypage.svg" class="w-6 mr-4" />
            マイページ
          </button>
        </div>
      </transition>
    </div>
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
      width: window.innerWidth,
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
  mounted: function() {
    window.addEventListener('resize', this.handleResize)
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
    handleResize: function() {
      this.width = window.innerWidth
    },
  },
  directives: {
    ClickOutside,
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style lang="sass" scoped>
.menu-enter-active, .menu-leave-active
  transition: all .5s ease

.menu-enter, .menu-leave-to
  transform: translateY(-120px)
</style>
