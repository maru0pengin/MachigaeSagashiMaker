<template>
  <div class="container">
    <UploadSteps />
    <router-view />
  </div>
</template>

<script>
import UploadSteps from "@/components/UploadSteps";

export default {
  name: "UploadLayout",
  components: { UploadSteps },
};
</script>
