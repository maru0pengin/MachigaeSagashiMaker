<template>
  <div class="min-h-screen pb-10">
    <Loading v-bind:loading="loading" />
    <transition>
      <div v-show="!loading" class="mt-24 mb-20 mx-auto w-11/12">
        <img
          src="@/assets/logo/logo_large.png"
          class="w-[600px] mt-4 mb-8 mx-auto"
        />
        <button @click="gotoCreate" class="create_button">
          まちがいさがしを作る
        </button>
        <div class="flex mx-3 mb-2 justify-center md:justify-start">
          <input
            type="text"
            v-model="filterInput"
            class="mt-8 px-2 py-1 border border-blue-300 hover:border-blue-400 rounded-lg placeholder-gray-300 outline-none"
            placeholder="キーワード検索"
            required
          />
        </div>

        開発途中であるため、告知なくデータの削除等を行う可能性があります。
        あらかじめご了承ください。
        <!--
        <div class="description flex mr-auto pl-4 pt-4">お知らせ</div>
        <div class="flex flex-col pl-4 pt-4 text-sm">
          <div class="mr-auto">2021/5/19 ログイン機能を追加しました</div>
          <div class="mr-auto">2021/5/19 投稿作品の削除機能を追加しました</div>
        </div>
        -->
        <div
          class="font-bold text-gray-900 text-2xl text-blue-500 flex mr-auto pl-4 pt-4"
        >
          新着
        </div>
        <div class="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="quizze in filteredItems" :key="quizze.id">
            <button
              type="primary"
              @click="gotoGame(quizze.id)"
              class="focus:outline-none m-1 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              <div
                v-show="!loading"
                class="m-2 bg-white border-4 rounded-lg overflow-hidden relative"
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
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import { getAuthor } from '@/utils/get_author'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
  data() {
    return {
      quizzes: [],
      loading: true,
      filterInput: '',
    }
  },
  components: {
    Loading,
  },
  created: function() {
    this.db = firebase.firestore() // dbインスタンスを初期化
  },
  mounted: async function() {
    const script = document.createElement('script')

    script.src = 'opencv.js'
    document.head.appendChild(script)
    //スクロール位置を指定
    scrollTo(0, 0)

    //const startTime = performance.now()
    //間違え問題を取得
    this.db
      .collection('quizzes')
      .where('isPublic', '==', true)
      .orderBy('createdAt', 'desc')
      .get()
      .then(async (querySnapshot) => {
        //console.log(performance.now() - startTime)
        for (let doc of querySnapshot.docs) {
          //作者がいれば、リファレンスから作者の名前を取得
          let author = await getAuthor(doc)
          let name = author ? author.displayName : doc.data().name
          this.quizzes.push({
            id: doc.id,
            title: doc.data().title,
            name: name,
            date: doc.data().createdAt.toDate(),
            img: doc.data().quiz[0].images.correct,
          })
        }
        //console.log(performance.now() - startTime)
      })
      .catch(() => {
        this.$message.error(
          'エラーが発生しました。時間を置いて再度お試しください。'
        )
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
    user() {
      return this.$store.getters.user
    },
  },
  methods: {
    gotoGame(id) {
      this.$router.push({
        name: 'Play',
        query: this.$route.query,
        params: { id: id },
      })
    },
    gotoCreate() {
      this.$router.push({
        name: 'imageUpload',
        query: this.$route.query,
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

.create_button
  transition: all 0.25s ease
  cursor: pointer
  @apply border-2 border-blue-400 text-2xl text-blue-400 font-extrabold font-sans bg-white mx-auto mt-4 px-8 py-2 rounded-full hover:bg-blue-400 hover:text-white focus:outline-none md:hover:tracking-widest
</style>
