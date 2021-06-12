<template>
  <div>
    <div v-show="isShowCorrect" class="correctBox mx-auto mb-4">
      <p class="text-left font-bold">見本画像</p>
      <img :src="correctImage" width="300" class="mx-auto border-2" />
    </div>
    <h3 class="description">間違え位置を塗りつぶしてください</h3>
    <button
      @click="showCorrect"
      class="block py-1 ml-auto text-blue-400 font-bold focus:outline-none"
    >
      <p v-if="isShowCorrect">見本画像を閉じる</p>
      <p v-else>見本画像を確認</p>
    </button>
    <div class="w-[400px] h-[225px] mx-auto ">
      <img :src="incorrectImage" class="border-4 absolute" />
      <canvas
        id="drawimg"
        ref="drawimg"
        width="400"
        height="225"
        class="border-4 opacity-50 z-10 absolute"
        @mousedown="dragStart"
        @touchstart="touchStart"
        @mouseup="dragEnd"
        @mouseout="dragEnd"
        @touchend="touchEnd"
        @mousemove="draw"
        @touchmove="touchDraw"
      ></canvas>
    </div>
    <div class="flex flex-col mt-4">
      <div class="font-bold text-lg mr-auto">太さを選択</div>
      <div class="flex items-center">
        <button
          v-for="(buttonItem, key) in buttonItems"
          :key="key"
          class="font-bold w-16 h-16 focus:outline-none"
          v-bind:class="{ button_border: thickness === buttonItem }"
          @click="changeThickness(buttonItem)"
        >
          <div
            class="bg-red-500 rounded-full mx-auto"
            v-bind:class="[`w-[${buttonItem}px]`, `h-[${buttonItem}px]`]"
          ></div>
        </button>
      </div>
    </div>
    <button class="main_button mt-4 mx-2" @click="gotoBack">戻る</button>
    <button @click="clear" class="main_button mt-8">クリア</button>
    <button @click="labelling" class="main_button mt-8 ml-4 ">OK</button>

    <Modal
      v-bind:show="isShowModal"
      @close="closeModal"
      v-bind:klass="'w-[460px]'"
    >
      <div class="mx-auto ">
        <h3 class="font-bold text-gray-900 text-lg">
          間違いは<span class="text-blue-500 text-2xl">{{
            differencesNum
          }}</span
          >つ設定されています
        </h3>
      </div>
      <div class="w-[400px] h-[225px] mt-4">
        <img :src="incorrectImage" class="border-4 absolute" />
        <canvas
          id="resultimg"
          ref="dstimg"
          width="400"
          height="225"
          class="border-2 z-10 absolute opacity-50"
        ></canvas>
        <img src="" ref="img" class="img" />
      </div>
      <div class="flex mx-auto">
        <div class="ml-auto">
          <button class="main_button mt-4 mx-2" @click="closeModal">
            キャンセル
          </button>
        </div>
        <div class="ml-auto">
          <button class="main_button mt-4 mx-2" @click="gotoNext">
            OK
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  name: 'test',
  components: {
    Modal,
  },
  data() {
    return {
      canvas: null,
      context: null,
      isMobile: false,
      isShowModal: false,
      isDrag: false,
      positionX: null,
      positionY: null,
      differencesNum: 0,
      isShowCorrect: false, //見本画像を表示するかのフラグ
      test: 'aiueo',
      buttonItems: [50, 40, 30, 20, 10],
      thickness: 30,
      labels: null,
      centroids: [],
    }
  },
  props: {
    correctImage: String,
    incorrectImage: String,
    defaltCorrect: String,
    defaltIncorrect: String,
  },
  mounted() {
    //スクロール位置を指定
    scrollTo(0, 0)
    // 画像が渡されてない場合は、アップロード画面へ飛ばす
    if (!this.correctImage || !this.incorrectImage)
      this.$router.push({ name: 'imageUpload', query: this.$route.query })
    this.loadImg()
    this.canvas = document.querySelector('#drawimg')
    this.canvas.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    })
    this.context = this.canvas.getContext('2d')
    this.context.lineCap = 'round'
    this.context.lineJoin = 'round'
    this.context.lineWidth = 30
    this.context.strokeStyle = '#ff0000'
    window.addEventListener('scroll', this.getCanvasCoordinates)
    this.getCanvasCoordinates()
  },
  methods: {
    draw(e) {
      if (!this.isMobile) {
        var x = e.layerX
        var y = e.layerY
        if (!this.isDrag) return
        this.context.lineTo(x, y)
        this.context.stroke()
      }
    },
    // 描画開始（mousedown）
    dragStart(e) {
      if (!this.isMobile) {
        var x = e.layerX
        var y = e.layerY
        this.context.beginPath()
        this.context.moveTo(x, y)
        this.context.lineTo(x, y)
        this.context.stroke()
        this.isDrag = true
      }
    },
    // 描画終了（mouseup, mouseout）
    dragEnd() {
      this.context.closePath()
      this.isDrag = false
    },
    touchDraw(e) {
      var x = e.changedTouches[0].clientX - this.positionX
      var y = e.changedTouches[0].clientY - this.positionY
      this.context.lineTo(x, y)
      this.context.stroke()
    },
    touchStart(e) {
      this.test = 'test'
      this.isMobile = true
      var x = e.changedTouches[0].clientX - this.positionX
      var y = e.changedTouches[0].clientY - this.positionY
      this.context.beginPath()
      this.context.moveTo(x, y)
      this.context.lineTo(x + 1, y + 1) //同じ座標だと線画引けない為
      this.context.stroke()
    },
    touchEnd(e) {
      var x = e.changedTouches[0].clientX - this.positionX
      var y = e.changedTouches[0].clientY - this.positionY
      this.context.lineTo(x, y)
      this.context.stroke()
      this.context.closePath()
    },
    handleTouchMove(event) {
      event.preventDefault()
    },
    async labelling() {
      let src = this.$cv.Mat.zeros(400, 255, this.$cv.CV_8U)
      src = this.$cv.imread(this.$refs.drawimg)
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
        (await this.$cv.connectedComponentsWithStats(
          gray,
          markers,
          stats,
          floatCentroids
        )) - 1
      //重心を取得
      await this.getCenters(floatCentroids)
      //ラベリングのカラー付け
      src = await this.colouring(markers, src)
      this.$cv.imshow('resultimg', src)
      src.delete()
      dst.delete()
      gray.delete()
      markers.delete()
      stats.delete()
      floatCentroids.delete()

      if (this.differencesNum === 0) {
        this.$message.warning('間違え箇所を設定してください', {
          showClose: false,
          type: 'error',
        })
      } else this.isShowModal = true
    },
    async colouring(markers, src) {
      let result = []
      for (let i = 0; i < markers.rows; i++) {
        let col = []
        for (let j = 0; j < markers.cols; j++) {
          let num = markers.intPtr(i, j)[0]
          col.push(num)

          if (num != 0) {
            //ランダムな色を割り当てる
            src.ucharPtr(i, j)[num % 3] = 200
            src.ucharPtr(i, j)[(num + 1) % 3] = num * 20
            src.ucharPtr(i, j)[(num + 2) % 3] = num * 50
          }
        }
        result.push(col)
      }
      this.labels = result
      return src
    },
    async getCenters(markers) {
      for (let i = 1; i < markers.rows; i++) {
        this.centroids.push({
          x: markers.doublePtr(i, 0)[0],
          y: markers.doublePtr(i, 1)[0],
        })
      }
    },
    loadImg() {
      let src = this.$refs.drawimg
      let ctx = src.getContext('2d')
      let img = this.$refs.img //new Image()
      ctx.drawImage(img, 0, 0)
    },
    clear() {
      this.context.clearRect(0, 0, 400, 255)
      let src = this.$cv.imread(this.$refs.drawimg)
      this.$cv.imshow('resultimg', src)
    },
    closeModal() {
      this.isShowModal = false
    },
    showCorrect() {
      this.isShowCorrect = !this.isShowCorrect
      this.getCanvasCoordinates
    },
    changeThickness(thickness) {
      this.thickness = thickness
      this.context.lineWidth = thickness
    },
    getCanvasCoordinates() {
      let clientRect = this.canvas.getBoundingClientRect()
      this.positionX = clientRect.left
      this.positionY = clientRect.top
    },
    gotoNext() {
      console.log(this.labels)
      console.log(this.centroids)
      this.$router.push({
        name: 'setInformations',
        query: this.$route.query,
        params: {
          correctImage: this.correctImage,
          incorrectImage: this.incorrectImage,
          defaltCorrect: this.defaltCorrect,
          defaltIncorrect: this.defaltIncorrect,
          differences: this.differences,
          labels: this.labels,
          centroids: this.centroids,
        },
      })
    },
    gotoBack() {
      this.$router.push({
        name: 'trim',
        query: this.$route.query,
        params: {
          correctImage: this.defaltCorrect,
          incorrectImage: this.defaltIncorrect,
        },
      })
    },
  },
  beforeDestroy() {
    this.canvas.removeEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    })
    window.removeEventListener('scroll', this.getCanvasCoordinates)
  },
}
</script>

<style lang="sass" scoped>
.correctBox
  width: 300px
.button_border
  @apply border-4 border-blue-200 rounded-md
</style>
