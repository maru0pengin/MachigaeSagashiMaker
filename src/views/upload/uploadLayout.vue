<template>
  <div class="h-full">
    <div class="mt-14 w-3/4 mx-auto">
      <UploadSteps />
    </div>

    <div class="min-w-screen flex justify-center my-16">
      <div
        class="flex flex-col max-w-md bg-white py-6 px-10 rounded-xl items-center shadow-lg border-4"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import UploadSteps from '@/components/UploadSteps'

export default {
  name: 'UploadLayout',
  components: { UploadSteps },
}
</script>
