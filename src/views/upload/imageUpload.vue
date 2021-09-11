<template>
  <div>
    <Modal
      v-bind:show="isShowModal"
      v-bind:klass="'w-5/6 md:w-2/3 lg:w-1/3'"
      @close="toggleModal"
    >
      <p class="mx-auto description">まちがいさがしを作ろう！</p>
      <div class="text-sm mt-2">
        <div class="text-left">
          以下の項目を満たした<span class="font-bold text-lg">2つの画像</span
          >を用意してください
          <div class="my-2">
            ・<span class="font-bold">同じサイズ</span
            >の見本画像と間違い画像<br />
            ・<span class="font-bold">横長</span
            >にトリミングされることを想定した画像<br />
          </div>
        </div>
      </div>
      <div class="min-h-40 mx-auto mt-2 min-h-[100px]">
        <img src="@/assets/example.jpg" class="w-auto" />
      </div>
      <div class="text-left text-xs">
        ※Twitterログインを行わずに作品を投稿すると、投稿後に作品を削除することはできません。
        <router-link to="/login" class="text-blue-500 font-bold"
          >Twitterログインはこちら
        </router-link>
      </div>
      <div class="ml-auto">
        <button class="main_button mt-4 mx-2" @click="toggleModal">OK</button>
      </div>
    </Modal>
    <h3 class="description">
      見本画像と間違え画像を<br />アップロードしてください
    </h3>
    <hr />

    <div class="p-4">
      <p v-if="correctImage === null">見本画像が選択されていません</p>
      <img v-else :src="correctImage.src" class="border-2 my-2" width="300" />
      <el-upload
        action=""
        :http-request="upload"
        accept="image/*"
        :show-file-list="false"
      >
        <button
          v-on:click="correctUploadFlag = true"
          class="upload_button w-64"
        >
          <i class="el-icon-top" />見本画像をアップロード
        </button>
      </el-upload>

      <p class="pt-2" v-if="incorrectImage === null">
        間違え画像が選択されていません
      </p>
      <img v-else :src="incorrectImage.src" class="border-2 my-2" width="300" />
      <el-upload
        action=""
        :http-request="upload"
        accept="image/*"
        :show-file-list="false"
      >
        <button
          v-on:click="incorrectUploadFlag = true"
          class="upload_button w-64"
        >
          <i class="el-icon-top" />間違え画像をアップロード
        </button>
      </el-upload>
    </div>
    <button class="main_button mt-4" @click="gotoNext">次へ</button>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
const reader = new FileReader()
export default {
  name: 'imageUpload',
  data: () => ({
    correctUploadFlag: false,
    incorrectUploadFlag: false,
    correctImage: null,
    incorrectImage: null,
    isShowModal: false,
  }),
  mounted() {
    setTimeout(() => {
      this.isShowModal = true
    }, 100)
  },
  components: { Modal },
  methods: {
    upload({ file }) {
      const image = new Image()
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
        .then((imageSrc) => {
          image.onload = () => {
            if (this.correctUploadFlag) {
              // 見本画像のupの際、間違え画像がupされていて、かつサイズが異なったらエラー表示
              if (this.incorrectImage) {
                if (this.JudgementSize(image, this.incorrectImage)) {
                  this.correctImage = image
                } else
                  this.$message.error(
                    '見本画像と間違え画像は同じサイズにしてください'
                  )
              } else this.correctImage = image
            } else if (this.incorrectUploadFlag) {
              if (this.correctImage) {
                if (this.JudgementSize(image, this.correctImage)) {
                  this.incorrectImage = image
                } else
                  this.$message.error(
                    '見本画像と間違え画像は同じサイズにしてください',
                    { showClose: false, type: 'error' }
                  )
              } else this.incorrectImage = image
            }
            this.correctUploadFlag = false
            this.incorrectUploadFlag = false
          }
          image.src = imageSrc
        })
        .catch(() => {
          this.correctUploadFlag = false
          this.incorrectUploadFlag = false
          this.$notify({
            type: 'error',
            title: 'Error',
            message:
              '画像の読み込みに失敗しました。時間をおいて再度お試しください',
          })
        })
    },
    JudgementSize(image1, image2) {
      return (
        image1.naturalWidth == image2.naturalWidth &&
        image1.naturalHeight == image2.naturalHeight
      )
    },
    gotoNext() {
      if (this.correctImage && this.incorrectImage) {
        this.$router.push({
          name: 'trim',
          query: this.$route.query,
          params: {
            correctImage: this.correctImage.src,
            incorrectImage: this.incorrectImage.src,
          },
        })
      } else {
        this.$message.warning(
          '見本画像と間違え画像をアップロードしてください',
          {
            showClose: false,
            type: 'error',
          }
        )
      }
    },
    toggleModal() {
      this.isShowModal = !this.isShowModal
    },
  },
}
</script>
