<template>
  <div class="mt-14">
    <div id="canvas" class="canvas shadow bg-white">
      <p class="font-bold text-xl pl-2 pt-2">{{ title }}</p>
      <p class="text-right text-sm pl-2 pr-2">{{ name }}</p>
      <hr />
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
const WIDTH = 400;
const HEIGHT = 600;

import * as PIXI from "pixi.js"; // node_modulesから PIXI.jsをインポート

export default {
  data: function () {
    return {
      correctImgPath: ``, //正解画像のパスを入れる
      incorrectImgPath: ``, //不正解画像のパスを入れる
      app: null,
      timmer: 0,
      displayTimmer: "",
      gameLoops: [], // 毎フレーム毎に実行する関数たち
      text: "",
      title: null,
      name: null,
      differences: [],
      textTimer: "",
      resources: null,
      db: null,
    };
  },
  created: function () {
    this.db = firebase.firestore(); // dbインスタンスを初期化
  },
  computed: {
    id: function () {
      return this.$route.params.id;
    },
  },
  mounted: async function () {
    //間違え位置の取得
    let docRef = await this.db.collection("quizzes").doc(this.id);
    docRef
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          //データが存在しているか確認
          console.log("Document data:", doc.data());
          this.title = doc.data().title;
          this.name = doc.data().name;
          //間違えの位置を取得し、ステータス情報等を追加してdifferencesへ保存
          for (let i = 0; i < doc.data().differences.length; i++) {
            this.differences[i] = {
              ...doc.data().differences[i],
              status: 0,
              obj: null,
              circleObj: null,
            };
          }
          //画像の取得
          let ref;
          ref = await firebase.storage().ref().child(`${this.id}/correct.png`);
          await ref.getDownloadURL().then((url) => {
            this.correctImgPath = url;
          });
          ref = await firebase
            .storage()
            .ref()
            .child(`${this.id}/incorrect.png`);
          await ref.getDownloadURL().then((url) => {
            this.incorrectImgPath = url;
          });

          this.app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
          let el = document.getElementById("canvas");
          el.appendChild(this.app.view);

          // ゲームcanvasのcssを定義する
          // ここで定義した画面サイズ(width,height)は実際に画面に表示するサイズ
          this.app.renderer.view.style.position = "relative";
          this.app.renderer.view.style.width = "400px";
          this.app.renderer.view.style.height = "600px";
          this.app.renderer.view.style.display = "block";

          // canvasの背景色
          this.app.renderer.backgroundColor = 0xffffff;

          PIXI.Loader.shared
            .reset()
            .add(this.correctImgPath)
            .add(this.incorrectImgPath);

          // プリロード処理が終わったら呼び出されるイベント
          PIXI.Loader.shared.load((loader, resources) => {
            //resources["../assets/crear.mp3"].sound.play() // クリックで音が鳴る
            this.resources = resources;
            this.createGameScene();
          });
        } else {
          // doc.data() が未定義の場合
          console.log("No such document!");
          this.$router.push({ name: "Home", query: this.$route.query });
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        this.$router.push({ name: "Home", query: this.$route.query });
      });
  },
  methods: {
    createGameScene() {
      // 一座標確認に使用
      this.app.view.addEventListener("pointerdown", (ev) => {
        console.log(ev.layerX, ev.layerY);
      });
      this.timmer = 0;
      this.differences.forEach((difference) => {
        difference.status = 0;
      });
      this.removeAllScene();
      this.removeAllGameLoops();

      // ゲーム用のシーンを生成
      const gameScene = new PIXI.Container();
      // ゲームシーンを画面に追加
      this.app.stage.addChild(gameScene);

      const image1 = new PIXI.Sprite(
        this.resources[this.correctImgPath]?.texture
      );
      image1.x = 0;
      image1.y = 70;
      gameScene.addChild(image1); // 見本画像ををシーンに追加

      const image2 = new PIXI.Sprite(
        this.resources[this.incorrectImgPath].texture
      );

      image2.x = 0;
      image2.y = 350;
      gameScene.addChild(image2); // 間違え画像をシーンに追加

      //ヒットエリアの描画
      const length = 30; //ヒットエリアの幅
      const radius = 20; //正解時に出す縁の半径

      this.differences.forEach((difference) => {
        difference.obj = new PIXI.Graphics();
        let rect = new PIXI.Rectangle(
          difference.x - length / 2,
          difference.y - length / 2 + 350,
          length,
          length
        );
        difference.obj.beginFill(0xfff000, 0.2); //ヒットエリアは透明
        difference.obj.drawShape(rect);
        difference.obj.endFill();

        difference.obj.interactive = true; // クリック可能にする
        difference.obj.hitArea = rect;

        difference.obj.on("pointerdown", function () {
          // クリック時に発動する関数
          if (difference.status === 0) {
            //console.log(correctCircles[0])
            //正解を示す円を表示させる
            difference.CircleObj = new PIXI.Graphics();
            difference.CircleObj.lineStyle(5, 0xec6d71, 1);
            difference.CircleObj.drawCircle(
              difference.x,
              difference.y - radius / 2 + 350,
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
        gameScene.addChild(difference.obj); //間違い範囲の図形をシーンに追加
      });

      // テキストに関するパラメータを定義する(ここで定義した意外にもたくさんパラメータがある)
      const textStyle = new PIXI.TextStyle({
        fontFamily: "Myriad", // フォント
        fontSize: 20, // フォントサイズ
        fill: 0x696969, // 色(16進数で定義する)
      });
      this.text = new PIXI.Text(
        `間違い:0/${this.differences.length}`,
        textStyle
      ); //スコア表示テキスト
      this.text.y = 3;
      this.text.x = 3;
      gameScene.addChild(this.text); // スコア表示テキストを画面に追加する

      this.textTimer = new PIXI.Text("Timer:0", textStyle); //スコア表示テキスト
      this.textTimer.y = 3;
      this.textTimer.x = 150;
      gameScene.addChild(this.textTimer); // スコア表示テキストを画面に追加する

      const mihon = new PIXI.Text("見本", textStyle); //スコア表示テキスト
      mihon.y = 40;
      mihon.x = 15;
      gameScene.addChild(mihon); // スコア表示テキストを画面に追加する

      const description = new PIXI.Text(
        "下のイラストの間違えをタップしよう！",
        textStyle
      ); //スコア表示テキスト
      description.y = 310;
      description.x = 15;
      gameScene.addChild(description); // スコア表示テキストを画面に追加する

      this.addGameLoop(this.gameLoop);
    },
    /**
     * 毎フレーム処理を追加する関数
     */
    addGameLoop(gameLoopFunction) {
      this.app.ticker.add(gameLoopFunction); // 毎フレーム処理として指定した関数を追加
      this.gameLoops.push(gameLoopFunction); // 追加した関数は配列に保存する（後で登録を解除する時に使う）
    },
    removeAllScene() {
      this.app.stage.removeChildren();
    },
    removeAllGameLoops() {
      // gameLoopsに追加した関数を全部tickerから解除する
      for (const gameLoop of this.gameLoops) {
        this.app.ticker.remove(gameLoop);
      }
      this.gameLoops = []; // gameLoopsを空にする
    },
    gameLoop() {
      // 毎フレームごとに処理するゲームループ
      // スコアテキストを毎フレームアップデートする
      let score = this.differences.filter(function (difference) {
        //console.log(difference.status)
        return difference.status === 1;
      });

      this.text.text = `間違い:${score.length}/${this.differences.length}`;
      this.timmer += 1 / 60;
      this.displayTimmer = this.timmer.toFixed(2);

      this.textTimer.text = `Timer:${this.displayTimmer}`;

      if (score.length === this.differences.length) {
        this.createEndScene(); // 結果画面を表示する
        //resources["../sound/crear.mp3"].sound.play() // クリックで音が鳴る
      }
    },
    createEndScene() {
      // 他に表示しているシーンがあれば削除
      this.removeAllScene();
      // 毎フレームイベントを削除
      this.removeAllGameLoops();

      // ゲーム用のシーン表示
      const endScene = new PIXI.Container();
      // シーンを画面に追加する
      this.app.stage.addChild(endScene);

      // テキストに関するパラメータを定義する(ここで定義した意外にもたくさんパラメータがある)
      const textStyle = new PIXI.TextStyle({
        fontFamily: "Myriad", // フォント
        fontSize: 28, // フォントサイズ
        fill: 0x696969, // 色(16進数で定義する これはオレンジ色)
      });

      // テキストオブジェクトの定義
      const text = new PIXI.Text(
        `${this.displayTimmer}秒で間違えを\n見つけられました！`,
        textStyle
      ); // 結果画面のテキスト
      text.anchor.x = 0.5; // アンカーのxを中央に指定
      text.x = 200; // 座標指定 (xのアンカーが0.5で中央指定なので、テキストのx値を画面中央にすると真ん中にテキストが表示される)
      text.y = 100; // 座標指定 (yのアンカーはデフォルトの0なので、画面上から200の位置にテキスト表示)
      endScene.addChild(text); // 結果画面シーンにテキスト追加

      //自作のボタン生成関数を使って、もう一度ボタンを生成
      //引数の内容はcreateButton関数を参考に
      const retryButton = this.createButton(
        "もう一度",
        120,
        60,
        0xf09199,
        () => {
          // クリック"した時の処理
          this.createGameScene(); // ゲームシーンを生成する
        }
      );
      retryButton.x = 40; // ボタンの座標指定
      retryButton.y = 500; // ボタンの座標指定
      endScene.addChild(retryButton); // ボタンを結果画面シーンに追加

      const tweetButton = this.createButton(
        "ツイート",
        120,
        60,
        0x82cddd,
        () => {
          //ツイートＡＰＩに送信
          //結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
          const url = encodeURI("https://machigae-game.web.app/"); // ツイートに載せるURLを指定(文字はエンコードする必要がある)
          window.open(
            `http://twitter.com/intent/tweet?text=${this.displayTimmer}秒で間違えを\n見つけられました！&url=${url}`
          ); //ハッシュタグをsampleにする
        }
      );
      tweetButton.x = 240; // ボタンの座標指定
      tweetButton.y = 500; // ボタンの座標指定
      endScene.addChild(tweetButton); // ボタンを結果画面シーンに追加
    },
    createButton(text, width, height, color, onClick) {
      const buttonAlpha = 1.0; // ボタン背景の透明度
      const buttonContainer = new PIXI.Container(); // ボタンコンテナ（ここにテキストと背景色を追加して返り値とする）

      // ボタン作成
      const backColor = new PIXI.Graphics(); // グラフィックオブジェクト（背景に半透明な四角を配置するために使用）
      backColor.beginFill(color, buttonAlpha); // 色、透明度を指定して描画開始
      backColor.drawRect(0, 0, width, height); // 位置(0,0)を左上にして、width,heghtの四角形を描画
      backColor.endFill(); // 描画完了
      backColor.interactive = true; // クリック可能にする
      backColor.on("pointerdown", onClick); // クリック時にonClickの関数を実行する
      buttonContainer.addChild(backColor); // 背景をボタンコンテナに追加

      // テキストに関するパラメータを定義する(ここで定義した意外にもたくさんパラメータがある)
      const textStyle = new PIXI.TextStyle({
        fontFamily: "Myriad", // フォント
        fill: 0xffffff, // 色(16進数で定義する これはオレンジ色)
      });

      const buttonText = new PIXI.Text(text, textStyle); // テキストオブジェクトをtextStyleのパラメータで定義
      buttonText.anchor.x = 0.5; // アンカーを中央に設置する(アンカーは0~1を指定する)
      buttonText.anchor.y = 0.5; // アンカーを中央に設置する(アンカーは0~1を指定する)
      buttonText.x = width / 2; // ボタン中央にテキストを設置するため、width/2の値をx値に指定
      buttonText.y = height / 2; // ボタン中央テキストを設置するため、height/2の値をy値に指定
      buttonContainer.addChild(buttonText); // ボタンテキストをボタンコンテナに追加
      return buttonContainer; // ボタンコンテナを返す
    },
  },
  beforeDestroy: function () {
    //キャッシュからすべてのテクスチャを削除
    PIXI.utils.clearTextureCache();
  },
};
</script>

<style>
.canvas {
  text-align: center;
  margin: 0 auto;
  width: 400px;
}
</style>