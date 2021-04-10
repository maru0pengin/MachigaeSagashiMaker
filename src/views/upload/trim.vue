<template>
  <div>
    <h3>画像を既定のサイズにトリミングしてください。</h3>
    <hr />
    <br />
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
        :src="correctImage"
        :img-style="{ width: '300px', height: '300px' }"
        :aspect-ratio="30 / 18"
        drag-mode="crop"
      />
      <br />

      <el-button @click="cropImage" v-if="correctImage !== ''"
        >トリミング</el-button
      >
    </div>
    <div v-show="false">
      <vue-cropper ref="cropper2" :src="incorrectImage" />
    </div>
    <div v-show="false">
      <canvas id="correct" width="100" height="100" />
      <canvas id="incorrect" width="100" height="100" />
    </div>
    <br />
    <img
      :src="resizeCorrect"
      class="upload-img"
      width="300"
      style="margin: 1rem"
    />
    <img
      :src="resizeIncorrect"
      class="upload-img"
      width="300"
      style="margin: 1rem"
    />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoBack">戻る</el-button>
      <el-button type="primary" @click="gotoNext">次へ</el-button>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  name: "trim",
  components: {
    VueCropper,
  },
  props: {
    correctImage: String,
    incorrectImage: String,
  },
  mounted() {
    // 画像のアップロードが住んでいない場合は、アップロード画面へ飛ばす
    if (!this.correctImage || !this.incorrectImage) this.gotoBack();
  },
  data() {
    return {
      cropCorrect: "",
      cropIncorrect: "",
      resizeCorrect: "",
      resizeIncorrect: "",
    };
  },
  methods: {
    cropImage() {
      this.Data = this.$refs.cropper1.getData();
      this.cropCorrect = this.$refs.cropper1.getCroppedCanvas().toDataURL();

      this.$refs.cropper2.setData(this.Data);
      this.cropIncorrect = this.$refs.cropper2.getCroppedCanvas().toDataURL();

      this.resizeImage("incorrect");
      this.resizeImage("correct");
    },
    resizeImage(id) {
      const width = 300;
      const height = 180;
      let img = new Image();
      let canvas = document.getElementById(id);
      canvas.width = width;
      canvas.height = height;
      let context = canvas?.getContext("2d");

      //あらかじめimgロード時の処理を設定しておく
      img.onload = () => {
        context.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          width,
          height
        );
        let base64 = canvas.toDataURL("image/png");

        if (id === "correct") this.resizeCorrect = base64;
        else this.resizeIncorrect = base64;
      };
      if (id === "correct") img.src = this.cropCorrect;
      else img.src = this.cropIncorrect;
    },
    gotoNext() {
      if (this.resizeCorrect && this.resizeIncorrect) {
        this.$router.push({
          name: "setDifferences",
          query: this.$route.query,
          params: {
            correctImage: this.resizeCorrect,
            incorrectImage: this.resizeIncorrect,
            defaltCorrect: this.correctImage,
            defaltIncorrect: this.incorrectImage,
          },
        });
      } else {
        this.$message.warning("画像のトリミングをしてください", {
          showClose: false,
          type: "error",
        });
      }
    },
    gotoBack() {
      this.$router.push({
        name: "imageUpload",
        query: this.$route.query,
      });
    },
  },
};
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