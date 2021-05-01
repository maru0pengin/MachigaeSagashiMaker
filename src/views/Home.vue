<template>
  <div class="min-h-screen">
    <div v-show="loading" class="h-screen flex justify-center items-center">
      <vue-loading
        type="spiningDubbles"
        color="#87ceeb"
        :size="{ width: '50px', height: '50px' }"
      />
    </div>

    <div v-show="!loading" class="my-2 mx-auto w-11/12">
      <div
        v-show="!loading"
        class="flex mx-3 mb-2 justify-center md:justify-start"
      >
        <input
          type="text"
          v-model="filterInput"
          class="mt-14 px-2 py-1 border border-blue-300 hover:border-blue-400 rounded-lg placeholder-gray-300 outline-none"
          placeholder="キーワード検索"
          required
        />
      </div>
      <transition>
        <div class="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="quizze in filteredItems" :key="quizze.id">
            <button
              type="primary"
              @click="gotoGame(quizze.id)"
              class="focus:outline-none m-1"
            >
              <div
                v-show="!loading"
                class="m-2 bg-white shadow-lg rounded-lg overflow-hidden relative"
              >
                <img class="object-cover" :src="quizze.img" />
                <p class="text-lg font-bold text-left pl-2 pt-2">
                  {{ quizze.title }}
                </p>
                <p class="text-left text-sm pl-2 pb-2">{{ quizze.name }}</p>
              </div>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { VueLoading } from "vue-loading-template";
import firebase from "firebase";

export default {
  data() {
    return {
      quizzes: [],
      loading: true,
      filterInput: "",
    };
  },
  components: {
    VueLoading,
  },
  created: async function() {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  mounted: async function() {
    //間違え問題を取得;
    this.db
      .collection("quizzes")
      .where("isPublic", "==", true)
      .orderBy("createdAt", "asc")
      .get()
      .then(async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          this.quizzes.push({
            id: doc.id,
            title: doc.data().title,
            name: doc.data().name,
            date: doc.data().createdAt.toDate(),
          });
        });
        for (let quizze of this.quizzes) {
          //画像の取得;
          let ref, img;
          ref = await firebase
            .storage()
            .ref()
            .child(`${quizze.id}/correct.png`);
          await ref.getDownloadURL().then((url) => {
            img = url;
          });
          this.$set(quizze, "img", img);
        }
        //this.filteredItems = JSON.parse(JSON.stringify(this.quizzes));
        this.loading = false;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  },
  computed: {
    // 文字列検索した候補者群
    filteredItems() {
      return this.filterInput
        ? this.quizzes.filter(
            (quizze) =>
              quizze.title.includes(this.filterInput) ||
              quizze.name.includes(this.filterInput)
          )
        : this.quizzes;
    },
  },
  methods: {
    gotoGame(id) {
      this.$router.push({
        name: "Play",
        query: this.$route.query,
        params: { id: id },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
h2
  font-size: 25px
  margin-top: 20px
h3
  font-size: 20px
.c_cropped_image
  border: 1px solid gray
.l_cropper_container
  width: 500px
  height: 500px
  border: 1px solid gray
  display: inline-block
.l_in_cropper_container
  width: 0px
  height: 0px
.v-leave-active,
.v-enter-active
  transition: opacity 1.5s
.v-enter,
.v-leave-to
  opacity: 0
</style>
