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
        <a :href="cropImg" :download="filename">画像を保存</a>
      </p>
      <br />
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      targetWidth: 1,
      targetHeight: 1,
      imgSrc: "",
      cropImg: "",
      filename: "",
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
  width: 500px;
  height: 500px;
  border: 1px solid gray;
}
.l_cropper_container {
  width: 500px;
  height: 500px;
  border: 1px solid gray;
  display: inline-block;
}
</style>