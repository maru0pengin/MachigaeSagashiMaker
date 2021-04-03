<template>
  <div style="font-size: 14px; text-align: center; width: 100vw">
    <h2>画像のトリミング</h2>
    <hr />
    <h3>画像を選択</h3>
    <input @change="setImage" type="file" name="image" accept="image/*" />
    <br />
    <div v-if="imgSrc !== ''" class="l_cropper_container">
      <vue-cropper
        ref="cropper"
        :guides="true"
        :view-mode="2"
        :auto-crop-area="0.5"
        :min-container-width="500"
        :min-container-height="500"
        :background="true"
        :rotatable="false"
        :src="imgSrc"
        :img-style="{ width: '500px', height: '500px' }"
        :aspect-ratio="targetWidth / targetHeight"
        drag-mode="crop"
      />
      <br />

      <button @click="cropImage" v-if="imgSrc !== ''">トリミング</button>
    </div>
    <br />
    <br />
    <br />
    <div v-if="cropImg !== ''">
      <img :src="cropImg" alt="Cropped Image" class="c_cropped_image" />
      <p>
        <a :href="resizeImg" :download="filename">画像を保存</a>
      </p>
      <br />
    </div>
    <div>
      <canvas id="sample" width="100" height="100">
        図形を表示するには、canvasタグをサポートしたブラウザが必要です。
      </canvas>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

//import firebase from "firebase";
//const ALREADY_UPLOADED = Symbol("ALREADY_UPLOADED"); //ユニークで不変なデータ型
//const storageRef = firebase.storage().ref();

export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      targetWidth: 30,
      targetHeight: 18,
      imgSrc: "",
      cropImg: "",
      resizeImg: "",
      filename: "",
      uploadedImages: {
        src: null, // 画像イメージのソース
        file: null, // 画像のFileオブジェクト。cloud storageに画像を保存済みの場合はFileオブジェクトではなくALREADY_UPLOADEDを入れる
      },
    };
  },
  methods: {
    setImage(e) {
      const file = e.target.files[0];
      this.filename = file.name;
      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.resizeImage();
    },
    resizeImage() {
      let width = 300;
      let height = 180;
      let img = new Image();

      let canvas = document.getElementById("sample");
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
        this.resizeImg = base64;
      };
      img.src = this.cropImg;
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 25px;
  margin-top: 20px;
}
h3 {
  font-size: 20px;
}
.c_cropped_image {
  border: 1px solid gray;
}
.l_cropper_container {
  width: 500px;
  height: 500px;
  border: 1px solid gray;
  display: inline-block;
}
</style>