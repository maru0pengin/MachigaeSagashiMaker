<template>
  <div>
    <h3 class="description">投稿が完了しました!!</h3>
    <div class="flex items-center px-2 py-1">
      <input
        class="w-60 text-sm font-sans border border-blue-200 rounded-l-lg px-2 py-1 border hover:border-blue-400 outline-none"
        type="text"
        v-model="location"
        readonly
      />
      <button
        class="text-sm inline-block px-1 py-1 w-24 font-medium leading-6 text-center text-white uppercase transition bg-blue-400 rounded-r-lg shadow hover:shadow-lg hover:bg-indigo-500 focus:outline-none"
        type="button"
        v-clipboard:copy="location"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >
        URLコピー
      </button>
    </div>
    <div></div>
    <hr />
    <div class="flex font-bold items-center text-sm my-2">
      SHARE
      <div class="w-full mr-2 flex justify-end">
        <ShareNetwork
          network="line"
          :url="location"
          :title="title"
          description="まちがいさがしメーカーで間違い探しを作成しました！是非遊んでみましょう！"
        >
          <img src="@/assets/icons/line.svg" class="w-8 h-8 mr-2" />
        </ShareNetwork>
        <button class="block focus:outline-none" type="primary" @click="tweet">
          <img src="@/assets/icons/Twitter_blue.svg" class="w-8 h-8" />
        </button>
      </div>
    </div>
    <hr />
    <div class="mt-1 centerize">
      <button class="main_button mx-2" type="primary" @click="gotoNext">
        ホームへ戻る
      </button>
    </div>
  </div>
</template>

<script>
import { ShareNetwork } from '/node_modules/vue-social-sharing/dist/vue-social-sharing'

export default {
  name: 'completed',
  props: {
    completedFlag: Boolean,
    id: String,
    title: String,
  },
  data() {
    return {
      location: String,
      message: 'Copy These Text',
    }
  },
  components: { ShareNetwork },
  computed: {
    tweetURL: function() {
      const url = encodeURI(`${this.location}`)
      return `http://twitter.com/intent/tweet?text=間違い探しを作成しました！%20%23まちがいさがしメーカー&url=${url}`
    },
  },
  mounted() {
    //完了フラグが渡されてない場合は、アップロード画面へ飛ばす
    if (!this.completedFlag) {
      this.$router.push({ name: 'imageUpload', query: this.$route.query })
    } else {
      this.location = `https://machigaesagashi.site/play/${this.id}`
    }
  },
  methods: {
    onCopy: function(e) {
      this.$message.success('URLのコピーに成功しました！:' + e.text)
    },
    onError() {
      this.$message.warning('URLのコピーに失敗しました')
    },
    tweet() {
      location.href = this.tweetURL
    },
    gotoNext() {
      this.$router.push({ name: 'Home', query: this.$route.query })
    },
  },
}
</script>

<style scoped>
.Twitter {
  background: #00acee;
}
</style>
