<template>
  <div>
    <FullScreenLoading v-bind:loading="loading" />
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

        <div v-if="!userStatus">
          <p class="px-4 text-left pt-2">ハンドルネームを入力してください</p>
          <input
            type="text"
            v-model="name"
            class="px-2 py-1 border border-blue-200 hover:border-blue-400 rounded-sm placeholder-gray-300 outline-none"
            placeholder="ハンドルネーム"
            required
          />
        </div>
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
      <Modal v-bind:show="isShowModal" @close="description">
        <p class="text-xl">公開とは?</p>
        <div class="text-sm mt-2">
          <p class="text-left">
            公開に設定すると、当サイトのトップページから誰でもこの問題を遊ぶことができます。
            非公開へ設定すると、問題のURLを知っている方のみ遊ぶことができます。
          </p>
        </div>
        <div class="ml-auto">
          <button class="main_button mx-2" @click="description">OK</button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

import Modal from '@/components/Modal'
import Firebase from './../../firebase'
import FullScreenLoading from '@/components/FullScreenLoading'
export default {
  name: 'setInformations',
  components: { Modal, FullScreenLoading },
  data() {
    return {
      db: null,
      title: '',
      name: '匿名さん',
      id: String,
      radio: '1',
      isShowModal: false,
      storageRef: null,
      loading: false,
    }
  },
  computed: {
    isPublic() {
      return this.radio === '1'
    },
    userStatus() {
      // ログインするとtrue
      return this.$store.getters.isSignedIn
    },
    user() {
      // ログインするとtrue
      return this.$store.getters.user
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
    Firebase.onAuth()
    this.db = firebase.firestore() // dbインスタンスを初期化
    this.storageRef = firebase.storage().ref()
  },
  mounted() {
    scrollTo(0, 0)
    //画像が渡されてない場合は、アップロード画面へ飛ばす
    if (!this.correctImage || !this.incorrectImage) {
      this.$router.push({ name: 'imageUpload', query: this.$route.query })
    }
  },
  methods: {
    async submit() {
      if (this.title && (this.name || this.userStatus)) {
        this.loading = true
        let uid,
          userRef = null
        if (this.userStatus) {
          uid = this.user?.uid
          userRef = this.db.collection('users').doc(uid)
        }

        let submitDifferences = this.differences.map((element) => {
          delete element.obj
          return element
        })
        let quizzesCollection = this.db.collection('quizzes')
        let images = {
          correct: this.correctImage,
          incorrect: this.incorrectImage,
        }
        let quiz = [
          {
            differences: submitDifferences,
            images: images,
          },
        ]
        // 「quizzes」というコレクションに対して {} で定義した情報を add する
        /*FireStoreへの保存*/
        const quizRef = await quizzesCollection
          .add({
            createdAt: new Date(),
            isPublic: this.isPublic,
            name: this.name ?? '',
            title: this.title,
            authorRef: userRef ?? '',
            quiz: quiz,
            playedCount: 0,
            imageURL: '',
          })
          .catch(() => {
            this.$message.warning(
              '作品の投稿に失敗しました。時間を置いて再度お試しください。',
              {
                showClose: false,
                type: 'error',
              }
            )
            return false
          })
        this.id = quizRef.id
        //storageへ見本画像を保存&URLの取得
        const imageURL = await this.saveImage(this.id)
        //firestoreへURLを保存
        await quizzesCollection.doc(this.id).update({
          imageURL: imageURL,
        })

        // ログインしているのであれば、usersコレクションへ作品情報を追加
        if (this.userStatus) {
          await userRef.update({
            works: firebase.firestore.FieldValue.arrayUnion(quizRef),
          })
        }
        this.loading = false
        this.gotoNext()
      } else {
        this.$message.warning('作品情報を入力してください', {
          showClose: false,
          type: 'error',
        })
      }
    },
    async saveImage(id) {
      let image_url = this.correctImage
      let ref = this.storageRef.child(`${id}/correct.png`)
      await ref.putString(image_url, 'data_url')
      return await ref.getDownloadURL()
    },
    description() {
      this.isShowModal = !this.isShowModal
    },
    gotoNext() {
      this.$router.push({
        name: 'completed',
        query: this.$route.query,
        params: {
          completedFlag: true,
          id: this.id,
        },
      })
    },
    gotoBack() {
      this.$router.push({
        name: 'setDifferences',
        query: this.$route.query,
        params: {
          correctImage: this.correctImage,
          incorrectImage: this.incorrectImage,
          defaltCorrect: this.defaltCorrect,
          defaltIncorrect: this.defaltIncorrect,
        },
      })
    },
  },
}
</script>
