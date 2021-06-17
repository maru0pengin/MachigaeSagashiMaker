<template>
  <div class="my-36 flex justify-center">
    {{ classObject }}
    <Loading v-bind:loading="loading" />
    <div v-show="!loading" class="main-card bg-white shadow">
      <p class="font-bold text-xl pl-2 pt-1">{{ title }}</p>

      <div class="flex items-end">
        <div class="text-left px-2 text-xl">
          間違い:{{ score }}/{{ differencesNum }}
        </div>
        <div class="px-4">Timer:{{ displayTimer }}</div>
        <div class="ml-auto text-sm pl-2 pr-2">{{ name }}</div>
      </div>
      <hr />

      <div v-if="!isStart" class="start-cover">
        <div class="flex flex-col bg-white rounded-2xl p-6">
          <div class="my-2">
            間違いは<span class="text-lg font-bold">{{ differencesNum }}個</span
            >あります。<br />
            上の画像と見比べて、<span class="text-lg font-bold">下の画像</span
            >の間違いを<br />タップ・クリックしよう！！
          </div>
          <button
            class="start_button"
            @click="
              () => {
                isStart = !isStart
              }
            "
          >
            スタート
          </button>
        </div>
      </div>
      <div class="mt-2">
        <div class="mx-auto">
          <p class="text-left text-xl font-bold px-2">みほん</p>
          <img :src="correctImgPath" class="border-2 w-[400px] mx-auto" />
        </div>
        <p class="pt-2">
          <span class="font-bold">下の画像の間違い</span
          >をタップ・クリックしよう!
        </p>
        <div class="mx-auto relative">
          <p class="text-left text-xl font-bold px-2">まちがい</p>
          <div class="relative border-2 w-[400px] mx-auto">
            <div
              class="absolute border-red-400 border-[6px] rounded-full mx-auto w-[40px] h-[40px]"
              v-bind:style="classObject[0]"
            ></div>
            <div
              class="absolute border-red-400 border-[6px] rounded-full mx-auto w-10 h-10"
              v-bind:style="classObject[1]"
            ></div>
            <div
              class="absolute border-red-400 border-[6px] rounded-full mx-auto w-10 h-10"
              v-bind:style="classObject[2]"
            ></div>
            <img :src="incorrectImgPath" />
          </div>

          <canvas v-show="false" id="srcimg" ref="srcimg"></canvas>
          <div v-show="false">
            <img src="" ref="img" class="" />
          </div>
        </div>
      </div>
    </div>
    <Modal v-bind:show="isCrear" v-bind:klass="'w-[350px]'">
      <h3 class="mx-auto mt-4 font-bold text-4xl text-yellow-400">
        クリア！！
      </h3>
      <p class="mx-auto my-2 text-xl">
        <span class="font-bold text-2xl">{{ displayTimer }}秒</span
        >で見つけられました！
      </p>
      <div class="mx-auto flex flex-col justify-center items-center mt-2">
        <button
          class="clear_button w-40"
          @click="tweet"
          v-bind:disabled="!isCrear"
        >
          ツイートする
        </button>
        <button class="clear_button w-40 mt-1" v-bind:disabled="!isCrear">
          もう一度遊ぶ
        </button>
        <button
          class="clear_button w-40 mt-1"
          @click="gotoHome"
          v-bind:disabled="!isCrear"
        >
          戻る
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import * as PIXI from 'pixi.js' // node_modulesから PIXI.jsをインポート
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { getAuthor } from '@/utils/get_author'

export default {
  data: function() {
    return {
      correctImgPath: '', //正解画像のパスを入れる
      incorrectImgPath: '', //不正解画像のパスを入れる
      differencesImage: '', //間違い位置の画像
      app: null,
      gameLoops: [], // 毎フレーム毎に実行する関数たち
      title: null,
      name: null,
      differences: [],
      differencesNum: 0,
      textTimer: '',
      resources: null,
      db: null,
      loading: true,
      timer: 0.0,
      displayTimer: '0.00',
      score: 0,
      isCrear: false,
      isStart: false,
      centroids: [],
    }
  },
  components: {
    Loading,
    Modal,
  },
  created: function() {
    this.db = firebase.firestore() // dbインスタンスを初期化
  },
  computed: {
    id: function() {
      return this.$route.params.id
    },
    location: function() {
      return location.href
    },
    tweetURL: function() {
      const url = encodeURI(`${location.href}`)
      return `http://twitter.com/intent/tweet?text=${this.displayTimer}秒で間違えを\n見つけられました！%20%23まちがいさがしメーカー&url=${url}`
    },
    classObject: function() {
      return [
        {
          top: `${this.centroids[0]?.x}px`,
          left: `${this.centroids[0]?.y}px`,
        },
        {
          top: `${this.centroids[1]?.x}px`,
          left: `${this.centroids[1]?.y}px`,
        },
        {
          top: `${this.centroids[2]?.x}px`,
          left: `${this.centroids[2]?.y}px`,
        },
      ]
    },
  },
  mounted: async function() {
    this.loadImg()
    //スクロール位置を指定
    if (window.innerWidth < 770) scrollTo(0, 78)
    else scrollTo(0, 0)

    //間違え位置の取得
    let docRef = await this.db.collection('quizzes').doc(this.id)
    docRef
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          if (doc.data().authorRef) {
            let author = await getAuthor(doc)
            this.name = author.displayName
          } else {
            this.name = doc.data().name
          }

          this.title = doc.data().title
          this.correctImgPath = doc.data().quiz[0].images.correct
          this.incorrectImgPath = doc.data().quiz[0].images.incorrect
          this.differencesImage = doc.data().quiz[0].differencesImage //間違い位置の画像

          let img = this.$refs.img
          img.src = this.differencesImage

          this.labelling()
        } else {
          // doc.data() が未定義の場合
          console.log('No such document!')
          this.$router.push({ name: 'Home', query: this.$route.query })
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error)
        this.$router.push({ name: 'Home', query: this.$route.query })
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    /**
     * 毎フレーム処理を追加する関数
     */
    addGameLoop(gameLoopFunction) {
      this.app.ticker.add(gameLoopFunction) // 毎フレーム処理として指定した関数を追加
      this.gameLoops.push(gameLoopFunction) // 追加した関数は配列に保存する（後で登録を解除する時に使う）
    },
    removeAllScene() {
      this.app.stage.removeChildren()
    },
    removeAllGameLoops() {
      // gameLoopsに追加した関数を全部tickerから解除する
      for (const gameLoop of this.gameLoops) {
        this.app.ticker.remove(gameLoop)
      }
      this.gameLoops = [] // gameLoopsを空にする
    },
    gameLoop() {
      // 毎フレームごとに処理するゲームループ
      // スコアテキストを毎フレームアップデートする
      if (this.isStart) {
        this.score = this.differences.filter(function(difference) {
          return difference.status === 1
        }).length

        this.timer += 1 / 60
        this.displayTimer = this.timer.toFixed(2)

        if (this.score === this.differences.length) {
          this.createEndScene() // 結果画面を表示する
        }
      }
    },
    tweet() {
      location.href = this.tweetURL
    },
    gotoHome() {
      this.$router.push({ name: 'Home', query: this.$route.query })
    },
    async labelling() {
      let src = this.$cv.imread(this.$refs.img)
      let dst = new this.$cv.Mat()
      let gray = new this.$cv.Mat()
      let markers = new this.$cv.Mat()
      let stats = new this.$cv.Mat()
      let floatCentroids = new this.$cv.Mat()
      // gray and threshold image
      this.$cv.cvtColor(src, gray, this.$cv.COLOR_RGBA2GRAY, 0)
      this.$cv.threshold(
        gray,
        gray,
        0,
        255,
        this.$cv.THRESH_BINARY_INV + this.$cv.THRESH_OTSU
      )
      //白黒を反転
      this.$cv.bitwise_not(gray, gray)
      //ラベリング
      this.differencesNum =
        this.$cv.connectedComponentsWithStats(
          gray,
          markers,
          stats,
          floatCentroids
        ) - 1
      //重心を取得
      await this.getCenters(floatCentroids)
      //ラベリングのカラー付け
      this.getDifferences(markers)

      src.delete()
      dst.delete()
      gray.delete()
      markers.delete()
      stats.delete()
      floatCentroids.delete()
    },
    getDifferences(markers) {
      for (let i = 0; i < markers.rows; i++) {
        let col = []
        for (let j = 0; j < markers.cols; j++) {
          let num = markers.intPtr(i, j)[0]
          col.push(num)
        }
        this.differences.push(col)
      }
    },
    async getCenters(markers) {
      for (let i = 1; i < markers.rows; i++) {
        this.centroids.push({
          x: parseInt(markers.doublePtr(i, 1)[0]) - 20,
          y: parseInt(markers.doublePtr(i, 0)[0]) - 20,
        })
      }
      console.log(this.centroids[0].x)
      console.log(this.centroids[0].y)
    },
    loadImg() {
      let src = this.$refs.srcimg
      let ctx = src.getContext('2d')
      let img = this.$refs.img //new Image()
      ctx.drawImage(img, 0, 0)
    },
  },
  beforeDestroy() {
    //キャッシュからすべてのテクスチャを削除
    PIXI.utils.clearTextureCache()
  },
}
</script>

<style>
.main-card {
  width: 424px;
  @apply border-4;
}
.start-cover {
  background-color: rgb(50, 50, 50, 0.95);
  width: 416px;
  height: 565px;
  @apply absolute z-10 flex justify-center items-center;
}
.clear_button {
  @apply px-4 py-1 text-sm font-medium leading-6 text-center text-white bg-blue-400 rounded-full shadow hover:shadow-lg focus:bg-indigo-500 focus:outline-none;
}
.start_button {
  transition: all 0.25s ease;
  cursor: pointer;
  @apply border-2 border-blue-400 text-5xl text-blue-400 font-extrabold font-sans bg-white mx-auto mt-4 py-2 px-8 rounded-full hover:bg-blue-400 hover:text-white focus:outline-none md:hover:tracking-widest;
}
</style>
