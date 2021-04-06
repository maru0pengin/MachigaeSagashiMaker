<template>
  <div>
    <h2>問題の情報を入力してください。</h2>
    <hr />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">次へ</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "setInformations",
  methods: {
    gotoNext() {
      this.$router.push({ name: "completed", query: this.$route.query });
    },
  },
};
</script>
