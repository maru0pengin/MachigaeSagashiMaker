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

      <p class="mt-4">問題を公開するか選択してください</p>
      <el-radio v-model="radio" label="1">公開</el-radio>
      <el-radio v-model="radio" label="2">非公開</el-radio>
      <br />
      <button
        class="text-xs text-blue-400 focus:outline-none"
        @click="description"
      >
        <i class="el-icon-question pr-1 pl-40"></i>公開とは？
      </button>
    </div>
    <div class="mt-1 centerize">
      <button class="main_button mx-2" @click="gotoBack">戻る</button>
      <button class="submit_button mx-2" @click="submit">
        保存して投稿完了
      </button>
    </div>
    <Modal v-bind:show="isShowModal" @from-child="description">
      <p class="text-xl">公開とは?</p>
      <div class="text-sm mt-2">
        <p class="text-left">
          公開に設定すると、当サイトのトップページから誰でもこの問題を遊ぶことができます。
          非公開へ設定すると、問題のURLを知っている方のみ遊ぶことができます。
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import firebase from "firebase";
import Modal from "@/components/Modal";
export default {
  name: "setInformations",
  components: { Modal },
  data() {
    return {
      db: null,
      storageRef: null,
      title: "",
      name: "",
      id: String,
      radio: "1",
      isShowModal: false,
    };
  },
  computed: {
    isPublic() {
      return this.radio === "1";
    },
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
    //画像が渡されてない場合は、アップロード画面へ飛ばす
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
            isPublic: this.isPublic,
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
    description() {
      this.isShowModal = !this.isShowModal
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
