<template>
  <div>
    <h3 class="description">
      画像を既定のサイズに<br />トリミングしてください
    </h3>
    <hr />
    <div class="mt-4">
      <div v-if="correctImage !== ''" class="l_cropper_container">
        <vue-cropper
          ref="cropper1"
          :guides="true"
          :view-mode="2"
          :auto-crop-area="0.5"
          :min-container-width="300"
          :min-container-height="300"
          :background="true"
          :rotatable="false"
          :movable="false"
          :zoomable="false"
          :checkOrientation="false"
          :src="correctImage"
          :img-style="{ width: '300px', height: '300px' }"
          :aspect-ratio="16 / 9"
          drag-mode="crop"
        />
        <br />
      </div>
      <div v-show="false">
        <vue-cropper ref="cropper2" :src="incorrectImage" :view-mode="2" />
      </div>
      <div v-show="false">
        <canvas id="correct" width="100" height="100" />
        <canvas id="incorrect" width="100" height="100" />
      </div>
      <br />
      <Modal v-bind:show="isShowModal" @close="closeModal">
        <div class="mx-auto">
          <h3 class="description">
            トリミング結果
          </h3>
          <div class="mx-auto">
            <p class="text-left font-bold px-2">見本画像</p>
            <img :src="resizeCorrect" width="300" class="border-2" />
          </div>
          <div class="mx-auto mt-2">
            <p class="text-left font-bold px-2">間違い画像</p>
            <img :src="resizeIncorrect" width="300" class="border-2" />
          </div>
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
    <div class="py-2">
      <button class="main_button mx-2" @click="gotoBack">戻る</button>
      <button
        class="upload_button"
        @click="cropImage"
        v-if="correctImage !== ''"
      >
        トリミング
      </button>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import Modal from '@/components/Modal'
import 'cropperjs/dist/cropper.css'
export default {
  name: 'trim',
  components: {
    VueCropper,
    Modal,
  },
  props: {
    correctImage: String,
    incorrectImage: String,
  },
  mounted() {
    scrollTo(0, 0)
    // 画像のアップロードが住んでいない場合は、アップロード画面へ飛ばす
    if (!this.correctImage || !this.incorrectImage) this.gotoBack()
  },
  data() {
    return {
      cropCorrect: '',
      cropIncorrect: '',
      resizeCorrect: '',
      resizeIncorrect: '',
      isShowModal: false,
    }
  },
  methods: {
    cropImage() {
      this.Data = this.$refs.cropper1.getData()
      this.cropCorrect = this.$refs.cropper1.getCroppedCanvas().toDataURL()
      this.$refs.cropper2.setData(this.Data)
      this.cropIncorrect = this.$refs.cropper2.getCroppedCanvas().toDataURL()

      this.resizeImage('incorrect')
      this.resizeImage('correct')
      this.isShowModal = true
    },
    resizeImage(id) {
      const width = 400
      const height = 225
      let img = new Image()
      let canvas = document.getElementById(id)
      canvas.width = width
      canvas.height = height
      let context = canvas?.getContext('2d')

      //あらかじめimgロード時の処理を設定しておく
      img.onload = () => {
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height)
        let base64 = canvas.toDataURL('image/png')

        if (id === 'correct') this.resizeCorrect = base64
        else this.resizeIncorrect = base64
      }
      if (id === 'correct') img.src = this.cropCorrect
      else img.src = this.cropIncorrect
    },
    gotoNext() {
      if (this.resizeCorrect && this.resizeIncorrect) {
        this.$router.push({
          name: 'setDifferences',
          query: this.$route.query,
          params: {
            correctImage: this.resizeCorrect,
            incorrectImage: this.resizeIncorrect,
            defaltCorrect: this.correctImage,
            defaltIncorrect: this.incorrectImage,
          },
        })
      } else {
        this.$message.warning('画像のトリミングをしてください', {
          showClose: false,
          type: 'error',
        })
      }
    },
    gotoBack() {
      this.$router.push({
        name: 'imageUpload',
        query: this.$route.query,
      })
    },
    closeModal() {
      this.isShowModal = false
    },
  },
}
</script>

<style scoped>
.c_cropped_image {
  border: 1px solid gray;
}
.l_cropper_container {
  width: 300px;
  height: 300px;
  border: 1px solid gray;
  display: inline-block;
}
</style>
