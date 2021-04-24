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
        class="text-sm inline-block px-3 py-1 font-medium leading-6 text-center text-white uppercase transition bg-blue-400 rounded-r-lg shadow hover:shadow-lg hover:bg-indigo-500 focus:outline-none"
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
    <div class="flex text-sm my-2">
      SHARE

      <div class="w-full mr-2 flex justify-end">
        <button
          class="block focus:outline-none"
          type="primary"
          @click="twitter"
        >
          <img src="@/assets/Twitter.png" class="w-5 h-5" />
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
export default {
  name: "completed",
  props: {
    completedFlag: Boolean,
    id: String,
  },
  data() {
    return {
      location: String,
      message: "Copy These Text",
    };
  },
  mounted() {
    //完了フラグが渡されてない場合は、アップロード画面へ飛ばす
    if (!this.completedFlag) {
      this.$router.push({ name: "imageUpload", query: this.$route.query });
    } else
      this.location = `${location.protocol}//${location.host}/play/${this.id}`;
  },
  methods: {
    onCopy: function(e) {
      this.$message.success("URLのコピーに成功しました！:" + e.text);
    },
    onError() {
      this.$message.warning("URLのコピーに失敗しました");
    },
    twitter() {
      //ツイートＡＰＩに送信
      //結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
      const url = encodeURI(this.location); // ツイートに載せるURLを指定(文字はエンコードする必要がある)
      window.open(
        `http://twitter.com/intent/tweet?text=間違え探しを作成しました！ &url=${url}`
      );
    },
    gotoNext() {
      this.$router.push({ name: "Home", query: this.$route.query });
    },
  },
};
</script>

<style scoped>
.Twitter {
  background: #00acee;
}
</style>
