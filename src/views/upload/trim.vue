<template>
  <div>
    <h2>画像を既定のサイズにトリミングしてください。</h2>
    <hr />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">次へ</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "trim",
  methods: {
    gotoNext() {
      this.$router.push({ name: "setDifferences", query: this.$route.query });
    },
  },
};
</script>
