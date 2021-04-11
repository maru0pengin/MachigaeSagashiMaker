<template>
  <div>
    <div class="mt-14">
      <UploadSteps />
    </div>

    <div class="min-h-screen min-w-screen flex justify-center mt-14">
      <div>
        <div class="flex flex-col max-w-md bg-white px-8 py-6 rounded-xl space-y-5 items-center shadow-lg">
         <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploadSteps from "@/components/UploadSteps";

export default {
  name: "UploadLayout",
  components: { UploadSteps },
};
</script>
