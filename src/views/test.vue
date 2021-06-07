<template>
  <div class="hello">
    <div>
      <input type="file" id="file" :name="files" @change="newimg" accept="image/*"/>
      <button @click="click">Try</button>
    </div>
    <div>
      <canvas id="srcimg" ref="srcimg" class="imgcanvas"></canvas>
      <canvas id="resultimg" ref="dstimg" class="imgcanvas"></canvas>
      <img src="" ref="img" class="img"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Main',
  data () {
    return {
      files: []
    }
  },
  mounted () {
    this.loadImg()
  },
  methods: {
    newimg(evt) {
      let files = evt.target.files
      if (!files.length) return
      let imgurl = URL.createObjectURL(files[0])
      let img = this.$refs.img
      img.src = imgurl
    },
    async click() {
      let src = this.$cv.imread(this.$refs.srcimg)
      let dst = new this.$cv.Mat();
      let gray = new this.$cv.Mat();
      let markers = new this.$cv.Mat();
      // gray and threshold image
      this.$cv.cvtColor(src, gray, this.$cv.COLOR_RGBA2GRAY, 0);
      this.$cv.threshold(gray, gray, 0, 255, this.$cv.THRESH_BINARY_INV + this.$cv.THRESH_OTSU);
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
      return src
    },
    loadImg(){
      let src = this.$refs.srcimg
      let ctx = src.getContext('2d')
      let img = this.$refs.img //new Image()

      img.onload = function() {
        src.height = img.height
        src.width = img.width
        ctx.drawImage(img, 0 ,0)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imgcanvas {
  width: 256px;
  height: 256px;
  border: 2px solid #000;
  margin: 10px;
}
.img {
  visibility: hidden;
}
#file {
  float: left;
}
</style>
