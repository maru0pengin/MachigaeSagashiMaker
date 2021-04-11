<template>
  <div>
    <h3 class="description">投稿が完了しました!!</h3>
    <hr />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">ホームへ戻る</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "completed",
  props: {
    completedFlag: Boolean,
  },
  mounted() {
    // 完了フラグが渡されてない場合は、アップロード画面へ飛ばす
    if (!this.completedFlag) {
      this.$router.push({ name: "imageUpload", query: this.$route.query });
    }
  },
  methods: {
    gotoNext() {
      this.$router.push({ name: "Home", query: this.$route.query });
    },
  },
};
</script>
