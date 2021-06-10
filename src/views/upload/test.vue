<template>
  <div>
    <transition>
      <div v-show="isShowCorrect" class="correctBox mx-auto mb-4">
        <p class="text-left font-bold">見本画像</p>
        <img src="@/assets/test.png" width="300" class="mx-auto border-2" />
      </div>
    </transition>
    <h3 class="description">間違え位置を設定してください</h3>
    <button
      @click="showCorrect"
      class="block py-1 ml-auto text-blue-400 font-bold focus:outline-none"
    >
      <p v-if="isShowCorrect">見本画像を閉じる</p>
      <p v-else>見本画像を確認</p>
    </button>
    <div class="w-[400px] h-[225px] mx-auto ">
      <img src="@/assets/test.png" class="border-4 absolute" />
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

    <button @click="labelling" class="mt-20">Try</button
    ><button @click="clear" class="mt-20">clear</button>
    {{ differencesNum }}
    <Modal v-bind:show="isShowModal" @close="closeModal">
      <div class="mx-auto">
        <h3 class="description">
          トリミング結果
        </h3>
      </div>
      <div class="w-[300px] mx-auto mt-10">
        <img src="@/assets/test.png" class="border-4 absolute" />
        <canvas
          id="resultimg"
          ref="dstimg"
          width="400"
          height="225"
          class="border-4 opacity-50 z-10 absolute"
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
            次へ
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
    }
  },
  mounted() {
    document.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    })
    this.loadImg()
    this.canvas = document.querySelector('#drawimg')
    this.context = this.canvas.getContext('2d')
    this.context.lineCap = 'round'
    this.context.lineJoin = 'round'
    this.context.lineWidth = 10
    this.context.strokeStyle = '#ff0000'
    this.context.fillStyle = 'rgb(255,255,255)'
    let clientRect = this.canvas.getBoundingClientRect()
    this.positionX = clientRect.left + window.pageXOffset
    this.positionY = clientRect.top + window.pageYOffset
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
      this.isMobile = true
      var x = e.changedTouches[0].clientX - this.positionX
      var y = e.changedTouches[0].clientY - this.positionY
      this.context.beginPath()
      this.context.lineTo(x, y)
      this.context.stroke()
    },
    touchEnd() {
      this.context.closePath()
    },
    handleTouchMove(event) {
      event.preventDefault()
    },
    async labelling() {
      let src = this.$cv.imread(this.$refs.drawimg)
      let dst = new this.$cv.Mat()
      let gray = new this.$cv.Mat()
      let markers = new this.$cv.Mat()
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
        (await this.$cv.connectedComponents(gray, markers)) - 1
      src = await this.colouring(markers, src)
      this.$cv.imshow('resultimg', src)
      src.delete()
      dst.delete()
      gray.delete()
      markers.delete()

      this.isShowModal = true
    },
    async colouring(markers, src) {
      let result = []
      for (let i = 0; i < markers.rows; i++) {
        let col = []
        for (let j = 0; j < markers.cols; j++) {
          let num = markers.intPtr(i, j)[0]
          col.push(num)
          if (num != 0) {
            src.ucharPtr(i, j)[num % 3] = 200
            src.ucharPtr(i, j)[(num + 1) % 3] = num * 20
            src.ucharPtr(i, j)[(num + 2) % 3] = num * 50
          }
        }
        result.push(col)
      }
      return src
    },
    loadImg() {
      let src = this.$refs.drawimg
      let ctx = src.getContext('2d')
      let img = this.$refs.img //new Image()
      ctx.drawImage(img, 0, 0)
    },
    async clear() {
      await this.context.clearRect(0, 0, 400, 255)
      let src = this.$cv.imread(this.$refs.drawimg)
      this.$cv.imshow('resultimg', src)
    },
    closeModal() {
      this.isShowModal = false
    },
    showCorrect () {
      this.isShowCorrect = !this.isShowCorrect
    },
    gotoNext() {}
  },
  beforeDestroy() {
    document.removeEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    })
  },
}
</script>

<style lang="sass" scoped>
.correctBox
  width: 300px

.v-leave-active,
.v-enter-active
  transition: opacity 0.2s
.v-enter,
.v-leave-to
  opacity: 0
</style>
