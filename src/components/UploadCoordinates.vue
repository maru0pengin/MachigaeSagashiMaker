<template>
  <div>
    <!--  DBに保存したデータを取得してきて表示する部分(全件)  -->
    <div class="outputAll">
      <button v-on:click="getAll()">GetAll</button>
      <p v-for="(output, key) in outputAll" :key="key">aiueo{{ output }}</p>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "UploadCoordinates",
  data () {
    return {
      db : null, // created で初期化
      outputAll : [], // 全件取得した時に全件分のデータを入れる
    }
  },
  created : function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  methods: {
    // 全件取得する
    getAll : function () {
      console.log(this.outputAll)
      // この先にあるthenでthisの参照が切れるのでselfに退避させておく
      let self = this;
      // 全件取得する
      let collection = this.db.collection("quizzes");
      collection.get().then((querySnapshot) => {
        self.outputAll = [];
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
          self.outputAll.push(doc.data())
        });
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
