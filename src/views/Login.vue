<template>
  <div><button @click="signin">Signin</button><br /></div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {}
  },
  methods: {
    signin() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase
        .auth()
        //.signInWithPopup(provider)
        .signInWithRedirect(provider)
        .then((result) => {
          if (result.user) {
            console.log(result.user)
          } else {
            alert("有効なアカウントではありません")
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style lang="sass" scoped></style>
