<template>
  <div class="mt-14">
    <div v-for="quizze in quizzes" :key="quizze.id">
      <button type="primary" @click="gotoGame(quizze.id)">
        <div v-show="!loading" class="bg-white shadow-lg rounded-xl overflow-hidden">
          <img class="object-cover" :src="quizze.img"/>
          {{quizze.title}}
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      quizzes: [],
    };
  },
  created: async function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  mounted: async function () {
    //間違え問題を取得
    this.db
      .collection("quizzes")
      .orderBy("createdAt", "asc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.quizzes.push({
            id: doc.id,
            title: doc.data().title,
            name: doc.data().name,
            date: doc.data().createdAt.toDate(),
            //img: img,
          });
          console.log(doc.id, " => ", doc.data());
        })
        console.log("ばぶー")
        this.quizzes.forEach(async(quizze) =>{
          console.log("はい")
          //画像の取得
          let ref,img;
          ref = await firebase.storage().ref().child(`${quizze.id}/correct.png`);
          await ref.getDownloadURL().then((url) => {
            img = url
          })
          this.$set(quizze,"img",img)
          //array[index].img = img
        })
        console.log(this.quizzes)
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    console.log("test3")



    // this.quizzes.forEach(async(quizze,index,array) =>{
    //   //画像の取得
    //   let ref,img;
    //   ref = await firebase.storage().ref().child(`${quizze.id}/correct.png`);
    //   //img = await ref.getDownloadURL()
    //   await ref.getDownloadURL().then((url) => {
    //     img = url
    //   })
    //   array[index].img = img
    // })
    console.log(this.quizzes)
  },
  methods: {
    gotoGame(id) {
      this.$router.push({
        name: "About",
        query: this.$route.query,
        params: { id: id },
      });
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 25px;
  margin-top: 20px;
}
h3 {
  font-size: 20px;
}
.c_cropped_image {
  border: 1px solid gray;
}
.l_cropper_container {
  width: 500px;
  height: 500px;
  border: 1px solid gray;
  display: inline-block;
}
.l_in_cropper_container {
  width: 0px;
  height: 0px;
}
</style>