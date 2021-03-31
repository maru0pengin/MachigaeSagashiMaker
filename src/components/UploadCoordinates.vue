<template>
  <div>
    <!--  入力 & 送信  -->
    <div class="input">
      <span>Input Text : </span>
      <input v-model="input" type="text">
      <button v-on:click="submit()">Submit</button>
    </div>
    <!--  DBに保存したデータを取得してきて表示する部分  -->
    <!--  一度データを入れていないと表示しない  -->
    <div class="output" v-if="inputDocRef != ''">
      <span>Output Text : {{ output }}</span>
      <button v-on:click="get()">Get</button>
    </div>
    <!--  DBに保存したデータを取得してきて表示する部分(全件)  -->
    <div class="outputAll">
      <button v-on:click="getAll()">GetAll</button>
      <p v-for="(output, key) in outputAll" :key="key">{{ output }}</p>
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
      input: '', // テキストを入力した時に v-model でデータを保存
      inputDocRef : '', // 保存したデータのIDを入れる（1件だけ取得する時に使う）
      output : '', // submit した後にDBからデータを取得してきたものを保存
      outputAll : [], // 全件取得した時に全件分のデータを入れる
    }
  },
  created : function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },    methods: {
      // DBにデータを送信する
      submit : function () {
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this;
        // 先程作った「sample」というコレクションを取得する
        let collection = this.db.collection("sample")
        // 「sample」というコレクションに対して {} で定義した情報を add する
        collection.add({
          text: this.input,
        }).then(function(docRef) {
          // 保存に成功した時
          console.log("Document written with ID: ", docRef.id);
          self.$emit('getId', docRef.id)
          // 1件だけ取得する処理のためにIDを保存しておく
          self.inputDocRef = docRef.id 
        }).catch(function(error) {
          // 保存に失敗した時
          console.error("Error adding document: ", error);
        });
      },
      // 1件だけ取得する
      get : function () {
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this;
        // 直前に保存したデータを1件取得してくる
        let collection = this.db.collection("quizzes")
        let docRef = collection.doc(this.inputDocRef);
        docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            self.output = doc.data();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      },
      // 全件取得する
      getAll : function () {
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this;
        // 全件取得する
        let collection = this.db.collection("sample");
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
