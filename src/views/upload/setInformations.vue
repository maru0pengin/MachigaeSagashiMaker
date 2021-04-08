<template>
  <div>
    <h2>問題の情報を入力してください。</h2>
    <hr />
    <span>作品名を入力してください : </span>
    <input v-model="title" type="text" />
    <br />
    <span>ハンドルネームを入力してください : </span>
    <input v-model="name" type="text" />

    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoBack">戻る</el-button>
      <el-button type="primary" @click="submit">保存して投稿完了</el-button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "setInformations",
  data() {
    return {
      db: null,
      storageRef: null,
      title: "",
      name: "",
    };
  },
  props: {
    correctImage: String,
    incorrectImage: String,
    differences: Array,
  },
  created: function () {
    console.log(this.differences);
    this.db = firebase.firestore(); // dbインスタンスを初期化
    this.storageRef = firebase.storage().ref();
  },
  methods: {
    submit() {
      /*FireStoreへの保存*/
      let submitDifferences = this.differences.map((element) => {
        delete element.obj;
        return element;
      });
      let collection = this.db.collection("quizzes");
      // 「quizzes」というコレクションに対して {} で定義した情報を add する
      let self = this;
      collection
        .add({
          title: this.title,
          name: this.name,
          createdAt: new Date(),
          differences: submitDifferences,
        })
        .then(function (docRef) {
          // 保存に成功した時
          console.log("Document written with ID: ", docRef.id);
          // Storageへ画像を保存
          self.saveImage(true, docRef.id);
          self.saveImage(false, docRef.id);
          self.gotoNext();
        })
        .catch(function (error) {
          // 保存に失敗した時
          console.error("Error adding document: ", error);
        });
    },
    saveImage(correct, id) {
      let ref, image_url;
      if (correct) {
        image_url = this.correctImage;
        ref = this.storageRef.child(`${id}/correct.png`);
      } else {
        image_url = this.incorrectImage;
        ref = this.storageRef.child(`${id}/incorrect.png`);
      }
      ref.putString(image_url, "data_url").then(() => {
        console.log("Uploaded a data_url string!");
      });
    },
    gotoNext() {
      this.$router.push({ name: "completed", query: this.$route.query });
    },
    gotoBack() {
      this.$router.push({ name: "setDifferences", query: this.$route.query });
    },
  },
};
</script>
