<template>
  <div>
    <el-upload
      action=""
      :http-request="upload"
      accept="image/*"
      :show-file-list="false"
    >
      <el-button><i class="el-icon-top" />写真アップロード</el-button>
    </el-upload>
    <p v-if="uploadedImages.src === null">選択されていません</p>
    <img
      v-else
      :src="uploadedImages.src"
      class="upload-img"
      width="400"
      style="margin: 1rem"
    />
    <div style="text-align: center">
      <el-button type="primary" @click="save">登録して次へ</el-button>
    </div>
    {{id}}
  </div>
</template>

<script>
import firebase from "firebase"
const ALREADY_UPLOADED = Symbol("ALREADY_UPLOADED"); //ユニークで不変なデータ型
const reader = new FileReader();
const storageRef = firebase.storage().ref();
export default {
  name: "UploadImage",
  props: {
    id: String
  },
  data: () => ({
    uploadedImages: {
      src: null, // 画像イメージのソース
      file: null, // 画像のFileオブジェクト。cloud storageに画像を保存済みの場合はFileオブジェクトではなくALREADY_UPLOADEDを入れる
      date: null, //IDとして使用する日付
    },
  }),
  computed: {
    /**
     * Cloud Storageの保存先
     */
    storagePath() {
      console.log("aiueo")
      console.log(this.id)
      return `${this.id}.png`;
    },
  },
  methods: {
    upload({ file }) {
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      })
        .then((imageSrc) => {
          this.uploadedImages = { src: imageSrc, file };
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
    save() {
      this.date = new Date();
      const { file } = this.uploadedImages;
      if (file === ALREADY_UPLOADED) {
        // cloud storageにアップロード済みかつ、ユーザーが選択画像を変更していないとき
        return this.goNext();
      }
      console.log("test")
      const ref = storageRef.child(this.storagePath);
      console.log(ref);
      ref
        .put(file)
        .then(() => {
          this.$notify({
            type: "success",
            title: "Success",
            message: "リファレンスチェックへのご協力ありがとうございました",
          });
          this.goNext();
        })
        .catch((err) => {
          this.$rollbar.error(err);
          this.$notify({
            type: "error",
            title: "Error",
            message:
              "名刺のアップロードに失敗しました。時間をおいて再度お試しください",
          });
        });
    },
    goNext() {
      //this.$router.push('home')
      console.log("終了");
    },
  },
};
</script>

<style scoped>
</style>
