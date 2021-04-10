<template>
  <div>
    <h2>間違え探し</h2>
    <div v-for="quizze in quizzes" :key="quizze.id">
      <el-button type="primary" @click="gotoGame(quizze.id)">{{
        quizze.title
      }}</el-button>
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
  created: function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  mounted: async function () {
    //間違え問題を取得
    this.db
      .collection("quizzes")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.quizzes.push({
            id: doc.id,
            title: doc.data().title,
            name: doc.data().name,
          });
          //console.log(doc);
          console.log(doc.id, " => ", doc.data());
        });
        console.log(this.quizzes);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
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