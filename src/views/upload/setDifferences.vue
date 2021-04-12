<template>
  <div>
    <h3 class="description">間違え位置を設定してください</h3>
    <hr />
    <br/>
    <div id="canvas"></div>
    <div >
      <button class="main_button mx-2" @click="gotoBack">戻る</button>
      <button class="main_button mx-2" @click="gotoNext">次へ</button>
    </div>
  </div>
</template>

<script>
const WIDTH = 300;
const HEIGHT = 180;
import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート

export default {
  name: "setDifferences",
  data() {
    return {
      app: null,
      resources: null,
      imgPath: null,
      differences: [],
      scene: null,
      deleteFlag: false, //間違えの追加か、削除か、切り替えのフラグ
    };
  },
  props: {
    correctImage: String,
    incorrectImage: String,
    defaltCorrect: String,
    defaltIncorrect: String,
  },
  mounted: async function () {
    // 画像が渡されてない場合は、アップロード画面へ飛ばす
    if (!this.correctImage || !this.incorrectImage) {
      this.$router.push({ name: "imageUpload", query: this.$route.query });
    }
    this.app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
    let el = document.getElementById("canvas");
    el.appendChild(this.app.view);

    // canvasのcssを定義する
    // ここで定義した画面サイズ(width,height)は実際に画面に表示するサイズ
    this.app.renderer.view.style.width = "300px";
    this.app.renderer.view.style.height = "180px";
    // canvasの背景色
    this.app.renderer.backgroundColor = 0xdeb887;

    this.scene = new PIXI.Container();
    this.app.stage.addChild(this.scene);

    const image = new Image();
    image.src = this.incorrectImage;
    image.onload = () => {
      // アップロードした画像をtextureとして読み込みspriteに貼り付ける
      const loadTexture = new PIXI.Texture(new PIXI.BaseTexture(image));
      const loadSprite = new PIXI.Sprite(loadTexture);
      // 画面にスプライトを追加
      this.scene.addChild(loadSprite);
    };
    //クリックを監視
    this.app.view.addEventListener("pointerup", (ev) => {
      if (!this.deleteFlag) {
        this.differences.push({ x: ev.offsetX, y: ev.offsetY });
        this.setDifference();
      } else this.deleteFlag = false;
    });
  },
  methods: {
    //クリックした間違え位置を記録
    setDifference() {
      const length = 30; //選択範囲の幅
      //最新のデータを取ってくる
      const latest = this.differences[this.differences.length - 1];
      latest.obj = new PIXI.Graphics();
      let rect = new PIXI.Rectangle(
        latest.x - length / 2,
        latest.y - length / 2,
        length,
        length
      );
      latest.obj.beginFill(0x008b8b, 0.5); //選択エリアの色を指定
      latest.obj.drawShape(rect);
      latest.obj.endFill();

      latest.obj.interactive = true; // クリック可能にする
      latest.obj.hitArea = rect;
      //既に間違えに登録されている範囲を押した際の処理
      latest.obj.on("pointerdown", () => {
        this.deleteFlag = true;
        //何番目の間違え位置かを取得
        let index = this.scene.getChildIndex(latest.obj);

        //選択された間違え位置を削除
        this.differences = this.differences.filter((n, i) => i !== index - 1);
        this.scene.removeChild(latest.obj);
      });
      console.log("test");
      this.scene.addChild(latest.obj);
    },
    gotoNext() {
      if (this.differences.length !== 0) {
        this.$router.push({
          name: "setInformations",
          query: this.$route.query,
          params: {
            correctImage: this.correctImage,
            incorrectImage: this.incorrectImage,
            defaltCorrect: this.defaltCorrect,
            defaltIncorrect: this.defaltIncorrect,
            differences: this.differences,
          },
        });
      } else {
        this.$message.warning("間違え箇所を設定してください", {
          showClose: false,
          type: "error",
        });
      }
    },
    gotoBack() {
      this.$router.push({
        name: "trim",
        query: this.$route.query,
        params: {
          correctImage: this.defaltCorrect,
          incorrectImage: this.defaltIncorrect,
        },
      });
    },
  },
};
</script>

<style scoped>
.c_cropped_image {
  border: 1px solid gray;
}
.l_cropper_container {
  width: 500px;
  height: 500px;
  border: 1px solid gray;
  display: inline-block;
}
</style>