const functions = require("firebase-functions");
const admin = require('firebase-admin')
admin.initializeApp()

// データベースの参照を作成
var firestore = admin.firestore()

exports.addUser = functions.auth.user().onCreate((user) => {

  firestore.collection("users")
    .doc(user.uid)
    .set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: user.displayName,
      twitterId: "",
      photoURL: user.photoURL,
    })
});

// exports.playpage = functions.https.onRequest(() => {
//   console.log("HTTP リクエストでの関数のトリガー")
// });