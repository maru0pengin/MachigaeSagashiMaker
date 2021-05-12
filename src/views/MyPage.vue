<template>
  <div class="min-w-screen flex justify-center my-16">
    <Loading v-bind:loading="loading" />
    <div
      class="flex flex-col max-w-md bg-white py-6 px-10 rounded-xl items-center shadow-lg  "
    >
      {{ user.displayName }}
      {{ user.uid }}
      <img v-bind:src="user.photoURL" class="w-16 h-16 rounded-full " />
      {{ user.works }}
      <button @click="getWorks">test</button>
    </div>

    <div v-for="work in works" :key="work.id">
      <button
        type="primary"
        @click="gotoGame(quizze.id)"
        class="focus:outline-none m-1"
      >
        <div
          v-show="!loading"
          class="m-2 bg-white shadow-lg rounded-lg overflow-hidden relative"
        >
          <img class="object-cover" :src="work.img" />
          <p class="text-lg font-bold text-left pl-2 pt-2">
            {{ work.title }}
          </p>
          <p class="text-left text-sm pl-2 pb-2">{{ work.name }}</p>
        </div>
      </button>
    </div>
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
          console.log(this.workPaths)
        }
      })
      // 作品のリファレンスから、作品の情報を取得
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
      console.log(this.works)
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
    getWorks() {
      console.log(this.user)
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

.button_twitter
 background: #00acee
 @apply p-4 rounded-lg flex

li
  @apply py-1
</style>
