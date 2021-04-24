<template>
  <div>
    <h3 class="description">問題の情報を入力してください</h3>
    <hr />
    <div>
      <p class="px-4 text-left pt-2">作品名を入力してください</p>
      <input
        type="text"
        v-model="title"
        class="px-2 py-1 border border-blue-200 hover:border-blue-400 rounded-sm placeholder-gray-300 outline-none"
        placeholder="作品名"
        required
      />

      <p class="px-4 text-left pt-2">ハンドルネームを入力してください</p>
      <input
        type="text"
        v-model="name"
        class="px-2 py-1 border border-blue-200 hover:border-blue-400 rounded-sm placeholder-gray-300 outline-none"
        placeholder="ハンドルネーム"
        required
      />
    </div>
    <div class="mt-1 centerize">
      <button class="main_button mx-2" @click="gotoBack">戻る</button>
      <button class="submit_button mx-2" @click="submit">
        保存して投稿完了
      </button>
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
      id: String,
    };
  },
  props: {
    correctImage: String,
    incorrectImage: String,
    defaltCorrect: String,
    defaltIncorrect: String,
    differences: Array,
  },
  created: function() {
    this.db = firebase.firestore(); // dbインスタンスを初期化
    this.storageRef = firebase.storage().ref();
  },
  mounted() {
    // 画像が渡されてない場合は、アップロード画面へ飛ばす
    if (!this.correctImage || !this.incorrectImage) {
      this.$router.push({ name: "imageUpload", query: this.$route.query });
    }
  },
  methods: {
    submit() {
      if (this.title && this.name) {
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
          .then(function(docRef) {
            // Storageへ画像を保存
            self.id = docRef.id;
            self.saveImage(true, docRef.id);
            self.saveImage(false, docRef.id);
            self.gotoNext();
          })
          .catch(function(error) {
            // 保存に失敗した時
            console.error("Error adding document: ", error);
          });
      } else {
        this.$message.warning("作品目とハンドルネームを入力してください", {
          showClose: false,
          type: "error",
        });
      }
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
      this.$router.push({
        name: "completed",
        query: this.$route.query,
        params: {
          completedFlag: true,
          id: this.id,
        },
      });
    },
    gotoBack() {
      this.$router.push({
        name: "setDifferences",
        query: this.$route.query,
        params: {
          correctImage: this.correctImage,
          incorrectImage: this.incorrectImage,
          defaltCorrect: this.defaltCorrect,
          defaltIncorrect: this.defaltIncorrect,
        },
      });
    },
  },
};
</script>
