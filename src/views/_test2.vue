<template>
  <div>     
    <button @click="click">Try</button>
    <canvas
      id="srcimg"
      ref="srcimg"
      class="mx-auto border-4 mt-10"
      width="400"
      height="225"
      @mousedown="dragStart"
      @touchstart="touchStart"
      @mouseup="dragEnd"
      @mouseout="dragEnd"
      @touchend="touchEnd"
      @mousemove="draw"
      @touchmove="touchDraw"
    ></canvas>
    <canvas  id="resultimg" ref="dstimg" width="400" height="225" class="mx-auto border-4 mt-10"></canvas>
    <img src="" ref="img" class="img"/>
  </div>
</template>

<script>
export default {
  name: 'setDifferences',
  data() {
    return {
      canvas: null,
      context: null,
      isMobile: false,
      isDrag: false,
      positionX: null,
      positionY: null,
    }
  },
  mounted() {
    document.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    })
    this.loadImg()
    this.canvas = document.querySelector('#srcimg')
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
      var x = e.changedTouches[0].clientX -this.positionX
      var y = e.changedTouches[0].clientY -this.positionY
      this.context.lineTo(x, y)
      this.context.stroke()
    },
    touchStart(e) {
      this.isMobile = true
      var x = e.changedTouches[0].clientX -this.positionX
      var y = e.changedTouches[0].clientY -this.positionY
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
    async click() {
      let src = this.$cv.imread(this.$refs.srcimg)
      let dst = new this.$cv.Mat();
      let gray = new this.$cv.Mat();
      let markers = new this.$cv.Mat();
      // gray and threshold image
      this.$cv.cvtColor(src, gray, this.$cv.COLOR_RGBA2GRAY, 0);
      this.$cv.threshold(gray, gray, 0, 255, this.$cv.THRESH_BINARY_INV + this.$cv.THRESH_OTSU);
      this.$cv.bitwise_not(gray,gray)
      // get connected components markers
      let num = this.$cv.connectedComponents(gray, markers);
      console.log(num-1)
      src = await this.colour(markers,src)
      this.$cv.imshow('resultimg', src);
      src.delete(); dst.delete(); gray.delete(); markers.delete();
    },
    async colour(markers,src){
      let result = []
      for (let i = 0; i < markers.rows; i++) {
        let col = []
        for (let j = 0; j < markers.cols; j++) {
          let num = markers.intPtr(i, j)[0]
          col.push(num)
          if(num!=0){
            src.ucharPtr(i,j)[num%3] = 200
            src.ucharPtr(i,j)[(num+1)%3] = num*20
            src.ucharPtr(i,j)[(num+2)%3] = num*50
          }
        }
        result.push(col)
      }
      console.log(result)
      return src
    },loadImg(){
      let src = this.$refs.srcimg
      let ctx = src.getContext('2d')
      let img = this.$refs.img //new Image()
      ctx.drawImage(img, 0 ,0)
      
    }
  },
  beforeDestroy() {
    document.removeEventListener('touchmove', this.handleTouchMove, { passive: false });
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
