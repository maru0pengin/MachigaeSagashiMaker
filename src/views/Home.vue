<template>
  <div class="min-h-screen">
    <Loading v-bind:loading="loading" />
    <transition>
      <div v-show="!loading" class="my-2 mx-auto w-11/12">
        <div
          v-show="!loading"
          class="flex mx-3 mb-2 justify-center md:justify-start"
        >
          <input
            type="text"
            v-model="filterInput"
            class="mt-14 px-2 py-1 border border-blue-300 hover:border-blue-400 rounded-lg placeholder-gray-300 outline-none"
            placeholder="キーワード検索"
            required
          />
        </div>

        <div class="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="quizze in filteredItems" :key="quizze.id">
            <button
              type="primary"
              @click="gotoGame(quizze.id)"
              class="focus:outline-none m-1"
            >
              <div
                v-show="!loading"
                class="m-2 bg-white shadow-lg rounded-lg overflow-hidden relative"
              >
                <img class="object-cover" :src="quizze.img" />
                <p class="text-lg font-bold text-left pl-2 pt-2">
                  {{ quizze.title }}
                </p>
                <p class="text-left text-sm pl-2 pb-2">{{ quizze.name }}</p>
              </div>
            </button>
          </div>
        </div>
        <button @click="signin">Signin</button><br />
        <button @click="signout">SignOut</button>
        {{ icon }}
        <img :src="icon" />
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
      quizzes: [],
      loading: true,
      filterInput: "",
      user: null,
    }
  },
  components: {
    Loading,
  },
  created: async function() {
    this.db = firebase.firestore() // dbインスタンスを初期化
  },
  mounted: async function() {
    this.user = firebase.auth().currentUser
    const startTime = performance.now()
    //間違え問題を取得;
    this.db
      .collection("quizzes")
      .where("isPublic", "==", true)
      .orderBy("createdAt", "asc")
      .get()
      .then(async (querySnapshot) => {
        console.log(performance.now() - startTime)
        querySnapshot.forEach(async (doc) => {
          this.quizzes.push({
            id: doc.id,
            title: doc.data().title,
            name: doc.data().name,
            date: doc.data().createdAt.toDate(),
          })
        })
        console.log(performance.now() - startTime)
        for (let quizze of this.quizzes) {
          //画像の取得;
          let ref, img
          ref = await firebase
            .storage()
            .ref()
            .child(`${quizze.id}/correct.png`)
          await ref.getDownloadURL().then((url) => {
            img = url
          })
          this.$set(quizze, "img", img)
        }
        console.log(performance.now() - startTime)
        //this.filteredItems = JSON.parse(JSON.stringify(this.quizzes));
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
      .finally(() => {
        this.loading = false
      })
  },
  computed: {
    // 文字列検索した候補者群
    filteredItems() {
      return this.filterInput
        ? this.quizzes.filter(
            (quizze) =>
              quizze.title.includes(this.filterInput) ||
              quizze.name.includes(this.filterInput)
          )
        : this.quizzes
    },
    icon: function() {
      return this.user?.photoURL
    },
  },
  methods: {
    gotoGame(id) {
      this.$router.push({
        name: "Play",
        query: this.$route.query,
        params: { id: id },
      })
    },
    signin: function() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase
        .auth()
        //.signInWithPopup(provider)
        .signInWithRedirect(provider)
        .then((result) => {
          if (result.user) {
            console.log(result.user)
            this.user = result.user
          } else {
            alert("有効なアカウントではありません")
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    signout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("サインアウトしました")
          location.reload()
        })
        .catch((error) => {
          console.log(error)
          // An error happened.
        })
    },
  },
}
</script>

<style lang="sass" scoped>
h2
  font-size: 25px
  margin-top: 20px
h3
  font-size: 20px
.v-leave-active,
.v-enter-active
  transition: opacity 1.5s
.v-enter,
.v-leave-to
  opacity: 0
</style>
