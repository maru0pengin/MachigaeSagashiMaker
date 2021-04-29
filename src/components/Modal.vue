<template>
  <transition>
    <div id="modal" v-show="show" class="modal-background">
      <div class="modal-content">
        <div class="flex flex-col items-start p-4">
        <slot />
          <div class="ml-auto">
            <button class="main_button mx-2" @click="closeModal">OK</button>
          </div>
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
    show: Boolean
  },
  methods: {
    closeModal: function () {
      this.showContent = false;
      this.$emit('from-child')
    },
  },
};
</script>

<style lang="sass" scoped>
.modal-background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-10
.modal-content
  max-height: 90vh
  @apply rounded-lg bg-white w-3/4 md:w-1/3  lg:w-1/3

.v-leave-active,
.v-enter-active
  transition: opacity 0.5s
.v-enter,
.v-leave-to
  opacity: 0
</style>
