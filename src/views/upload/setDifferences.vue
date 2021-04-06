<template>
  <div>
    <h2>間違え位置を設定してください。</h2>
    <hr />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">次へ</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "setDifferences",
  methods: {
    gotoNext() {
      this.$router.push({ name: "setInformations", query: this.$route.query });
    },
  },
};
</script>
