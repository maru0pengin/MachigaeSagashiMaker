import firebase from 'firebase/app'

if (firebase.apps.length === 0) {
  firebase.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG))

  console.log("aaaaaaaaaaaaaaaaaaa")
  console.log(process.env)
  if (process.env.VUE_APP_USE_FIRESTORE_EMULATOR) {
    firebase.firestore().settings({
      host: 'localhost:8080',
      ssl: false
    })
  }
}