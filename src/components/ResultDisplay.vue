<template>
  <transition>
    <div id="modal" v-show="show" class="modal-background" @click.self="close">
      <div class="modal-content" v-bind:class="[klass]">
        <div class="flex flex-col items-start p-4">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  data() {
    return {
      showContent: false,
    }
  },
  props: {
    show: Boolean,
    klass: String,
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="sass" scoped>
.modal-background
  background-color: rgba(0, 0, 0, 0.5)
  @apply flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-30
.modal-content
  max-height: 90vh

.v-leave-active,
.v-enter-active
  transition: opacity 0.5s
.v-enter,
.v-leave-to
  opacity: 0
</style>