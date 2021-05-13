<template>
  <div class="min-h-screen-1/2 flex justify-center my-16">
    <Loading v-bind:loading="loading" />
    <transition>
      <div
        v-show="!loading"
        class="flex flex-col max-w-md items-center grid grid-cols-1 "
      >
        <div>
          <div class="bg-white py-6 px-10 rounded-xl shadow-lg w-96 mx-auto">
            <h3 class="description">
              マイページ
            </h3>
            <hr />
            <div class="m-4">
              {{ user.displayName }}
              <img
                v-bind:src="user.photoURL"
                class="w-16 h-16 rounded-full mx-auto"
              />
            </div>
          </div>
          <div class="pt-8 pb-2">作成した間違え探し</div>
        </div>

        <div
          v-show="!workPaths"
          class="bg-gray-200 mx-auto w-60 p-2 mt-8 rounded-lg "
        >
          作成した間違え探しは<br />ありません
        </div>
        <div v-for="work in works" :key="work.id">
          <div class="m-1">
            <div
              v-show="!loading"
              class="m-2 bg-white shadow-lg rounded-lg overflow-hidden relative"
            >
              <button
                type="primary"
                @click="gotoGame(work.id)"
                class="focus:outline-none "
              >
                <img class="object-cover" :src="work.img" />
              </button>
              <p class="text-lg font-bold text-left pl-2 pt-2">
                {{ work.title }}
              </p>
              <button class="text-sm bg-red-100 flex ml-auto m-2">
                削除
              </button>
            </div>
          </div>
        </div>
        <router-link class="font-bold mt-10" to="/upload">
          間違え探しを作成するならこちら
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from "@/components/Loading"
import firebase from "firebase"
export default {
  data() {
    return {
      db: null,
      loading: true,
      workPaths: [],
      works: [],
    }
  },
  components: {
    Loading,
  },
  created: async function() {
    this.db = firebase.firestore() // dbインスタンスを初期化
  },
  computed: {
    userStatus() {
      // ログインするとtrue
      return this.$store.getters.isSignedIn
    },
    user() {
      return this.$store.getters.user
    },
  },
  mounted: async function() {
    if (this.user.uid) {
      // ユーザー情報から作品のリファレンスを取得
      let userRef = await this.db.collection("users").doc(this.user.uid)
      await userRef.get().then(async (doc) => {
        if (doc.exists) {
          this.workPaths = doc.data().works
        }
      })
      // 作品のリファレンスから、作品の情報を取得
      if (this.workPaths) {
        this.workPaths.forEach(async (path) => {
          let doc = await path.get()
          this.works.push({
            id: doc.id,
            title: doc.data().title,
            name: doc.data().name,
            date: doc.data().createdAt.toDate(),
            img: doc.data().quiz[0].images.correct,
          })
        })
      }
    } else {
      this.$router.push({
        name: "Home",
        query: this.$route.query,
      })
    }
    this.loading = false
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
    gotoGame(id) {
      this.$router.push({
        name: "Play",
        query: this.$route.query,
        params: { id: id },
      })
    },
  },
}
</script>

<style lang="sass" scoped>

.v-leave-active,
.v-enter-active
  transition: opacity 1.5s
.v-enter,
.v-leave-to
  opacity: 0
</style>
