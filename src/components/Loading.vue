<template>
  <div v-show="loading" class="h-screen flex justify-center items-center">
    <vue-loading
      type="spiningDubbles"
      color="#87ceeb"
      :size="{ width: '50px', height: '50px' }"
    />
  </div>
</template>

<script>
import { VueLoading } from "vue-loading-template";
export default {
  name: "Loading",
  components: {
    VueLoading,
  },
  props: {
    loading: Boolean,
  },
};
</script>

<style lang="sass" scoped></style>
