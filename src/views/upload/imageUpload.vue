<template>
  <div>
    <h3 class="description">
      見本画像と間違え画像を<br />アップロードしてください
    </h3>
    <hr />

    <div class="p-4">
      <p v-if="correctImage === null">見本画像が選択されていません</p>
      <img
        v-else
        :src="correctImage.src"
        class="border-2 my-2"
        width="300"
      />
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
      <img
        v-else
        :src="incorrectImage.src"
        class="border-2 my-2"
        width="300"
      />
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
    <button class="main_button" @click="gotoNext">次へ</button>
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
