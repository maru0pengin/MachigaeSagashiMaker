<template>
  <div>
    <upload-coordinates @getId="getId" />
    <upload-image v-bind:id="id"/>
    <p>{{ id }}</p>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage"
import UploadCoordinates from "@/components/UploadCoordinates"

export default {
  name: "upload",
  data () {
    return {
      id: ''
    }
  },
  components: { UploadImage, UploadCoordinates },
  methods: {
      getId (id) {
        console.log("test")
        this.id = id
      }
  }
};
</script>