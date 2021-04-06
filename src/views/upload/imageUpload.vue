<template>
  <div>
    <h2>見本画像と間違え画像を<br />アップロードしてください。</h2>
    <hr />
    <div class="mt-1 centerize">
      <el-button type="primary" @click="gotoNext">次へ</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "imageUpload",
  methods: {
    gotoNext() {
      this.$router.push({ name: "trim", query: this.$route.query });
    },
  },
};
</script>
