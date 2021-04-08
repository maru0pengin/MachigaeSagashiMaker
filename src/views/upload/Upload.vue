<template>
  <div>
    <div class="inputTitle">
      <span>作品名を入力してください : </span>
      <input v-model="title" type="text">
      <button v-on:click="submit()">Submit</button>
    </div>
    <p>{{ id }}</p>
    <upload-image v-bind:id="id"/>
    <upload-coordinates />

    <button v-on:click="loadImage()">画像表示</button>
    <img id=image />

  </div>
</template>

<script>
import firebase from 'firebase';

import UploadImage from "@/components/UploadImage"
import UploadCoordinates from "@/components/UploadCoordinates"

export default {
  name: "upload",
  data () {
    return {
      id: '',
      title: ''
    }
  },
  created : function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  components: { UploadImage, UploadCoordinates },
  methods: {
      submit : function () {
        let differences = [
            { x: 104, y: 394 },
            { x: 110, y: 425 },
            { x: 270, y: 405 },
        ]
        // 先程作った「sample」というコレクションを取得する
        let collection = this.db.collection("quizzes")
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this
        // 「sample」というコレクションに対して {} で定義した情報を add する
        collection.add({
          title: this.title,
          createdAt: new Date(),
          differences: differences
        }).then(function(docRef) {
          // 保存に成功した時
          console.log("Document written with ID: ", docRef.id)
          // IDを保存しておく
          self.id = docRef.id
        }).catch(function(error) {
          // 保存に失敗した時
          console.error("Error adding document: ", error);
        });
      },
      loadImage : function () {
        let ref = firebase.storage().ref().child('9ChD5hQqXHKIwe1QfABu')
        console.log(ref)
        ref.getDownloadURL().then((url) => {
          console.log(url)
          document.getElementById('image').src = url
        })
      }
  }
};
</script>