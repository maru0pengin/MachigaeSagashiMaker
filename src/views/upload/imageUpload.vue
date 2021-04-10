<template>
  <div>
    <h3>見本画像と間違え画像を<br />アップロードしてください</h3>
    <hr />

    <p v-if="correctImage === null">見本画像が選択されていません</p>
    <img
      v-else
      :src="correctImage.src"
      class="upload-img"
      width="300"
      style="margin: 1rem"
    />
    <el-upload
      action=""
      :http-request="upload"
      accept="image/*"
      :show-file-list="false"
    >
      <el-button v-on:click="correctUploadFlag = true"
        ><i class="el-icon-top" />見本画像をアップロード</el-button
      >
    </el-upload>

    <p v-if="incorrectImage === null">間違え画像が選択されていません</p>
    <img
      v-else
      :src="incorrectImage.src"
      class="upload-img"
      width="300"
      style="margin: 1rem"
    />
    <el-upload
      action=""
      :http-request="upload"
      accept="image/*"
      :show-file-list="false"
    >
      <el-button v-on:click="incorrectUploadFlag = true"
        ><i class="el-icon-top" />間違え画像をアップロード</el-button
      >
    </el-upload>

    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">次へ</el-button>
    </div>
  </div>
</template>

<script>
const reader = new FileReader();
export default {
  name: "imageUpload",
  data: () => ({
    correctUploadFlag: false,
    incorrectUploadFlag: false,
    correctImage: null,
    incorrectImage: null,
  }),
  methods: {
    upload({ file }) {
      const image = new Image();
      console.log(this.correctUploadFlag);
      console.log(this.incorrectUploadFlag);
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      })
        .then((imageSrc) => {
          image.onload = () => {
            let result = {
              width: image.naturalWidth,
              height: image.naturalHeight,
            };
            console.log(result);
            if (this.correctUploadFlag) {
              // 見本画像のupの際、間違え画像がupされていて、かつサイズが異なったらエラー表示
              if (this.incorrectImage) {
                if (this.JudgementSize(image, this.incorrectImage)) {
                  this.correctImage = image;
                } else
                  this.$message.error(
                    "見本画像と間違え画像は同じサイズにしてください"
                  );
              } else this.correctImage = image;
            } else if (this.incorrectUploadFlag) {
              if (this.correctImage) {
                if (this.JudgementSize(image, this.correctImage)) {
                  this.incorrectImage = image;
                } else
                  this.$message.error(
                    "見本画像と間違え画像は同じサイズにしてください",
                    { showClose: false, type: "error" }
                  );
              } else this.incorrectImage = image;
            }
            this.correctUploadFlag = false;
            this.incorrectUploadFlag = false;
          };
          image.src = imageSrc;
        })
        .catch(() => {
          //this.$rollbar.error(err);
          this.correctUploadFlag = false;
          this.incorrectUploadFlag = false;
          this.$notify({
            type: "error",
            title: "Error",
            message:
              "画像の読み込みに失敗しました。時間をおいて再度お試しください",
          });
        });
    },
    JudgementSize(image1, image2) {
      return (
        image1.naturalWidth == image2.naturalWidth &&
        image1.naturalHeight == image2.naturalHeight
      );
    },
    gotoNext() {
      console.log(typeof this.correctImage);
      if (this.correctImage && this.incorrectImage) {
        this.$router.push({
          name: "trim",
          query: this.$route.query,
          params: {
            correctImage: this.correctImage.src,
            incorrectImage: this.incorrectImage.src,
          },
        });
      } else {
        this.$message.warning(
          "見本画像と間違え画像をアップロードしてください",
          {
            showClose: false,
            type: "error",
          }
        );
      }
    },
  },
};
</script>
