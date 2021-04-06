<template>
  <div>
    <h2>投稿が完了しました!!</h2>
    <hr />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">ホームへ戻る</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "completed",
  methods: {
    gotoNext() {
      this.$router.push({ name: "Home", query: this.$route.query });
    },
  },
};
</script>
