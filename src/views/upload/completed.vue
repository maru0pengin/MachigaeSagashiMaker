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
    <div class="flex text-sm my-2">
      SHARE
      <div class="w-full mr-2 flex justify-end">
        <a
          href="https://twitter.com/share"
          v-bind:data-url="location"
          class="twitter-share-button"
          data-hashtags="MachigaeSagashi,間違え探し"
          >Tweet</a
        >
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
  computed: {
    encodeURI: function() {
      return encodeURI(`${this.location}`);
    },
  },
  mounted() {
    !(function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? "http" : "https";
      if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + "://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, "script", "twitter-wjs");
    //完了フラグが渡されてない場合は、アップロード画面へ飛ばす
    if (!this.completedFlag) {
      this.$router.push({ name: "imageUpload", query: this.$route.query });
    } else{
      this.location = `${location.protocol}//${location.host}/play/${this.id}`;
    }
  },
  methods: {
    onCopy: function(e) {
      this.$message.success("URLのコピーに成功しました！:" + e.text);
    },
    onError() {
      this.$message.warning("URLのコピーに失敗しました");
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
