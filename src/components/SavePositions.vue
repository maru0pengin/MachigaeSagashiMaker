<template>
  <div id="target">
    <div id="canvas"></div>
    <button v-on:click="submit()">Submit</button>
  </div>
</template>

<script>
import firebase from "firebase";
const WIDTH = 300;
const HEIGHT = 180;
import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート

if (firebase.apps.length === 0) {
  firebase.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG));
}
export default {
  data() {
    return {
      app: null,
      resources: null,
      db: null,
      blobUrl: null,
      imgPath: null,
      differences: [],
      gameScene: null,
      deleteFlag: false,
    };
  },
  props: {
    imgURL: String,
  },
  created: function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  mounted: async  function () {
    console.log("起動");
    this.app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
    let el = document.getElementById("canvas");
    el.appendChild(this.app.view);

    // ゲームcanvasのcssを定義する
    // ここで定義した画面サイズ(width,height)は実際に画面に表示するサイズ
    this.app.renderer.view.style.width = "300px";
    this.app.renderer.view.style.height = "180px";
    // canvasの背景色
    this.app.renderer.backgroundColor = 0xdeb887;

    // ゲーム用のシーンを生成
    this.gameScene = new PIXI.Container();
    // ゲームシーンを画面に追加
    this.app.stage.addChild(this.gameScene);

    const image = new Image()
    image.src = this.imgURL;
    image.onload = () => {
      // アップロードした画像をtextureとして読み込みspriteに貼り付ける
      const loadTexture = new PIXI.Texture(new PIXI.BaseTexture(image));
      const loadSprite = new PIXI.Sprite(loadTexture);
      // 画面にスプライトを追加
      this.gameScene.addChild(loadSprite);
    }

    this.app.view.addEventListener('pointerdown', (ev) => {
      if(!this.deleteFlag){
        //console.log(ev.offsetX, ev.offsetY)
        this.differences.push({x:ev.offsetX,y:ev.offsetY})
        console.log(this.differences)
        console.log("ライナー！！")
        this.setDifference()
      }else this.deleteFlag = false
    })


  },
  methods: {
    submit() {
      let submitDifferences = this.differences.map((element)=>{
        delete element.obj
        return element
      })
      // 先程作った「sample」というコレクションを取得する
      let collection = this.db.collection("sample")
      // この先にあるthenでthisの参照が切れるのでselfに退避させておく
      let self = this
      // 「sample」というコレクションに対して {} で定義した情報を add する
      collection.add({
        differences: submitDifferences
      }).then(function(docRef) {
        // 保存に成功した時
        console.log("Document written with ID: ", docRef.id)
        // IDを保存しておく
        self.id = docRef.id
      }).catch(function(error) {
        // 保存に失敗した時
        console.error("Error adding document: ", error);
      });
    },
    setDifference(){
      //ヒットエリアの描画
      const length = 30; //ヒットエリアの幅
      //const latest = this.differences.pop()
      const latest = this.differences[this.differences.length - 1]
      latest.obj = new PIXI.Graphics();
      let rect = new PIXI.Rectangle(
        latest.x - length / 2,
        latest.y - length / 2,
        length,
        length
      )
      latest.obj.beginFill(0x008b8b,0.5); //ヒットエリアは透明
      latest.obj.drawShape(rect);
      latest.obj.endFill();

      latest.obj.interactive = true; // クリック可能にする
      latest.obj.hitArea = rect;
      //let self = this
      latest.obj.on("pointerdown", ()=> {
        this.deleteFlag = true
        //latest.obj.clear()
        //this.gameScene.removeChildAt(0);
        //let test = this.gameScene.getChildAt(0)
        let index = this.gameScene.getChildIndex(latest.obj)

        this.differences = this.differences.filter((n,i)=> i !== (index-1))
        console.log(this.differences)
        //this.differences.splice(index,index)

        this.gameScene.removeChild(latest.obj)
        console.log(index)
        console.log("おだのぶ")
        console.log(this.differences)
      })
      this.gameScene.addChild(latest.obj);
      console.log(this.gameScene.children)
      //console.log(this.gameScene)

/*
      this.differences.forEach((difference) => {
        difference.obj = new PIXI.Graphics();
        let rect = new PIXI.Rectangle(
          difference.x - length / 2,
          difference.y - length / 2,
          length,
          length
        );
        difference.obj.beginFill(0x008b8b,0.5); //ヒットエリアは透明
        difference.obj.drawShape(rect);
        difference.obj.endFill();

        difference.obj.interactive = true; // クリック可能にする
        difference.obj.hitArea = rect;
        this.gameScene.addChild(difference.obj);

        difference.obj.on("pointerdown", function () {
          // クリック時に発動する関数
          if (difference.status === 0) {
            //console.log(correctCircles[0])
            //正解を示す円を表示させる
            difference.CircleObj = new PIXI.Graphics();
            difference.CircleObj.lineStyle(5, 0xec6d71, 1);
            difference.CircleObj.drawCircle(
              difference.x,
              difference.y - radius / 2,
              radius,
              radius
            );
            gameScene.addChild(difference.CircleObj);
            //正解数を増やす
            //this.upScore()
            //正解済みの間違えに設定
            difference.status = 1;
          }
        });

      })*/
    },
    async download(){
      let ref = await firebase
        .storage()
        .ref()
        .child("base64TEST");
      await ref.getDownloadURL().then((url) => {
        url = `${url}.png`;
        console.log("test")
        console.log(url)
      });
    }
  },
};
</script>

<style scoped>
div {
  background: red;
}
</style>