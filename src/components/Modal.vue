<template>
  <transition>
    <div id="modal" v-show="show" class="modal-background" @click.self="close">
      <div class="modal-content">
        <div class="flex flex-col items-start p-4">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      showContent: false,
    };
  },
  props: {
    show: Boolean,
  },
  methods:{
    close(){
      this.$emit('close')
    }
  }
};
</script>

<style lang="sass" scoped>
.modal-background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-30
.modal-content
  max-height: 90vh
  @apply rounded-lg bg-white w-5/6 md:w-2/3  lg:w-1/3

.v-leave-active,
.v-enter-active
  transition: opacity 0.5s
.v-enter,
.v-leave-to
  opacity: 0
</style>
