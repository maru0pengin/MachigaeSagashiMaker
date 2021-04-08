<template>
  <div>
    <h2>見本画像と間違え画像を<br />アップロードしてください</h2>
    <hr />

    <p v-if="correctImage === null">見本画像が選択されていません</p>
    <img
      v-else
      :src="correctImage"
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
      <el-button><i class="el-icon-top" />見本画像をアップロード</el-button>
    </el-upload>

    <p v-if="incorrectImage === null">間違え画像が選択されていません</p>
    <img
      v-else
      :src="incorrectImage"
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
      <el-button><i class="el-icon-top" />間違え画像をアップロード</el-button>
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
    correctImage: '',
    incorrectImage:''
  }),
  methods: {
    upload({ file }) {
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      })
        .then((imageSrc) => {
          if(this.correctImage) this.incorrectImage = imageSrc;
          else this.correctImage = imageSrc;
        })
        .catch((err) => {
          this.$rollbar.error(err);
          this.$notify({
            type: "error",
            title: "Error",
            message:
              "写真の読み込みに失敗しました。時間をおいて再度お試しください",
          });
        });
    },
    gotoNext() {
      this.$router.push({
        name: "trim",
        query: this.$route.query,
        params: {
          correctImage : this.correctImage,
          incorrectImage : this.incorrectImage
        }
      });
    },
  },
};
</script>
