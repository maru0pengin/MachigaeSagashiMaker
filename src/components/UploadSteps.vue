<template>
  <div class="wrapper">
    <el-steps :active="stepNumber" align-center finish-status="success">
      <el-step title="画像選択" />
      <el-step title="トリミング" />
      <el-step title="間違えの選択" />
      <el-step title="情報の入力" />
      <el-step title="完了" />
    </el-steps>
  </div>
</template>

<script>
const STEPS = {
  imageUpload: 0,
  trim: 1,
  setDifferences: 2,
  setInformations: 3,
  // すべてのステップにチェックをいれて、リファレンスチェックが完了したことを伝えるため通常よりも1大きい値を返す
  completed: 5,
};

export default {
  name: "UploadSteps",
  computed: {
    stepNumber() {
      return STEPS[this.$route.name];
    },
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  margin-bottom: 1rem
</style>
