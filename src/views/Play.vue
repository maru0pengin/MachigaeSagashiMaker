<template>
  <div class="my-14 flex justify-center">
    <Loading v-bind:loading="loading" />
    <div v-show="!loading" class="bg-white shadow max-w-md ">
      <p class="font-bold text-xl pl-2 pt-2">{{ title }}</p>
      <p class="text-right text-sm pl-2 pr-2">{{ name }}</p>
      <div class="flex">
        <div class="text-left px-2">
          間違い:{{ score }}/{{ differences.length }}
        </div>
        <div class="px-4">Timer:{{ displayTimer }}</div>
      </div>
      <hr />
      <div class="mt-4">
        <div class="correctBox mx-auto">
          <p class="text-left font-bold px-2">見本画像</p>
          <img :src="correctImgPath" class="border-2 w-full" />
        </div>
        <p class="py-2">下の画像の間違えをタップ・クリックしよう!</p>
        <p></p>
        <div id="canvas" class="canvas bg-white w-full border-2" />
      </div>
    </div>
    <Modal v-bind:show="isCrear">
      <div class="mx-auto">
        <h3 class="font-bold text-gray-900 text-2xl text-blue-500">
          クリア！！
        </h3>
        {{ displayTimer }}秒で見つけられました！
      </div>
      <div class="mx-auto flex justify-center items-center">
        <button class="min_button mx-2" @click="gotoHome">戻る</button>
        <button class="min_button mx-2" @click="createGameScene">
          再プレイ
        </button>
        <button class="min_button mx-2" @click="tweet">
          ツイート
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import firebase from "firebase"
const WIDTH = 400
const HEIGHT = 225

import * as PIXI from "pixi.js" // node_modulesから PIXI.jsをインポート
import Loading from "@/components/Loading"
import Modal from "@/components/Modal"
import { getAuthor } from "@/utils/get_author"

export default {
  // metaInfo() {
  //   return {
  //     prefix: "og: http://ogp.me/ns# article: http://ogp.me/ns/article#",
  //     meta: [
  //       {
  //         hid: "og:title",
  //         property: "og:title",
  //         content: this?.title,
  //       },
  //       {
  //         hid: "og:image",
  //         property: "og:image",
  //         content: this?.correctImgPath,
  //       },
  //     ],
  //   }
  // },
  data: function() {
    return {
      correctImgPath: "", //正解画像のパスを入れる
      incorrectImgPath: "", //不正解画像のパスを入れる
      app: null,
      gameLoops: [], // 毎フレーム毎に実行する関数たち
      title: null,
      name: null,
      differences: [],
      textTimer: "",
      resources: null,
      db: null,
      loading: true,
      timer: 0.0,
      displayTimer: "",
      score: null,
      isCrear: false,
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
  },
  mounted: async function() {
    //間違え位置の取得
    let docRef = await this.db.collection("quizzes").doc(this.id)
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
          //間違えの位置を取得し、ステータス情報等を追加してdifferencesへ保存
          for (let i = 0; i < doc.data().quiz[0].differences.length; i++) {
            this.differences[i] = {
              ...doc.data().quiz[0].differences[i],
              status: 0,
              obj: null,
              circleObj: null,
            }
          }
          this.app = new PIXI.Application({ width: WIDTH, height: HEIGHT })
          let el = document.getElementById("canvas")
          el.appendChild(this.app.view)

          // ゲームcanvasのcssを定義する
          // ここで定義した画面サイズ(width,height)は実際に画面に表示するサイズ
          this.app.renderer.view.style.position = "relative"
          this.app.renderer.view.style.width = "400px"
          this.app.renderer.view.style.height = "225px"
          this.app.renderer.view.style.display = "block"

          // canvasの背景色
          this.app.renderer.backgroundColor = 0xffffff

          PIXI.Loader.shared.reset().add(this.incorrectImgPath)

          // プリロード処理が終わったら呼び出されるイベント
          PIXI.Loader.shared.load((loader, resources) => {
            //resources["../assets/crear.mp3"].sound.play() // クリックで音が鳴る
            this.resources = resources
            this.createGameScene()
          })
        } else {
          // doc.data() が未定義の場合
          console.log("No such document!")
          this.$router.push({ name: "Home", query: this.$route.query })
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
        this.$router.push({ name: "Home", query: this.$route.query })
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    createGameScene() {
      this.timmer = 0
      this.isCrear = false

      this.differences.forEach((difference) => {
        difference.status = 0
      })
      this.removeAllScene()
      this.removeAllGameLoops()

      // ゲーム用のシーンを生成
      const gameScene = new PIXI.Container()
      // ゲームシーンを画面に追加
      this.app.stage.addChild(gameScene)

      const image = new PIXI.Sprite(
        this.resources[this.incorrectImgPath].texture
      )

      image.x = 0
      image.y = 0
      gameScene.addChild(image) // 間違え画像をシーンに追加

      //ヒットエリアの描画
      const length = 30 //ヒットエリアの幅
      const radius = 20 //正解時に出す縁の半径

      this.differences.forEach((difference) => {
        difference.obj = new PIXI.Graphics()
        let rect = new PIXI.Rectangle(
          difference.x - length / 2,
          difference.y - length / 2,
          length,
          length
        )
        difference.obj.beginFill(0xfff000, 0.0) //ヒットエリアは透明
        difference.obj.drawShape(rect)
        difference.obj.endFill()

        difference.obj.interactive = true // クリック可能にする
        difference.obj.hitArea = rect

        difference.obj.on("pointerdown", function() {
          // クリック時に発動する関数
          if (difference.status === 0) {
            //正解を示す円を表示させる
            difference.CircleObj = new PIXI.Graphics()
            difference.CircleObj.lineStyle(5, 0xec6d71, 1)
            difference.CircleObj.drawCircle(
              difference.x,
              difference.y - radius / 2 + 10,
              radius,
              radius
            )
            gameScene.addChild(difference.CircleObj)
            //正解数を増やす
            //this.upScore()
            //正解済みの間違えに設定
            difference.status = 1
          }
        })
        gameScene.addChild(difference.obj) //間違い範囲の図形をシーンに追加
      })
      this.addGameLoop(this.gameLoop)
    },
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
      this.score = this.differences.filter(function(difference) {
        return difference.status === 1
      }).length

      this.timer += 1 / 60
      this.displayTimer = this.timer.toFixed(2)

      if (this.score === this.differences.length) {
        this.createEndScene() // 結果画面を表示する
      }
    },
    createEndScene() {
      // 毎フレームイベントを削除
      this.removeAllGameLoops()

      this.timer = 0
      this.isCrear = true
      !(function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0],
          p = /^http:/.test(d.location) ? "http" : "https"
        if (!d.getElementById(id)) {
          js = d.createElement(s)
          js.id = id
          js.src = p + "://platform.twitter.com/widgets.js"
          fjs.parentNode.insertBefore(js, fjs)
        }
      })(document, "script", "twitter-wjs")
    },
    tweet() {
      location.href = this.tweetURL
    },
    gotoHome() {
      this.$router.push({ name: "Home", query: this.$route.query })
    },
  },
  beforeDestroy() {
    //キャッシュからすべてのテクスチャを削除
    PIXI.utils.clearTextureCache()
  },
}
</script>

<style>
.canvas {
  text-align: center;
  margin: 0 auto;
  width: 400px;
}
</style>
