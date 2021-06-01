<template>
  <div>
    <div class="h-screen" />
    <div class="background">
      <Loading v-bind:loading="true" />
    </div>
  </div>
</template>

<script>
//Playへすぐにリダイレクト
import Loading from '@/components/Loading'
export default {
  components: {
    Loading,
  },
}
</script>
<style lang="sass" scoped>
.background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-30
</style>
